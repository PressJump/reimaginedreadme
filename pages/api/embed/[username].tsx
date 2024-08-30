import type { NextApiRequest, NextApiResponse } from 'next'
import ReactDomServer from 'react-dom/server'
import { container } from '../../../components'
import {
	UserData,
	Repositories,
	Repository,
	customlist,
	Data,
	PanelProps,
	ContributionDay,
	ContributionCallendar,
} from '../../../utils/types'

const { graphql } = require('@octokit/graphql')

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')

	const username = req.query.username?.toString()
	const color = req.query.color?.toString()
	const titlecolor = req.query.titlecolor?.toString()
	const textcolor = req.query.textcolor?.toString()
	const bgcolor = req.query.bgcolor?.toString()
	const panels = req.query.panels?.toString().split(',')
	let userData = {} as UserData
	const panelProps: PanelProps = { color, titlecolor, textcolor, bgcolor }

	//username will exist but we should validate username
	if (!username || !/^[a-zA-Z0-9-]+$/.test(username)) {
		return res.status(400).json({ error: { message: 'Invalid username' } })
	}

	const validPanels = [
		'userstatistics',
		'toplanguages',
		'toprepositories',
		'commitgraph',
		'userwelcome',
		'customlist',
	]

	if (!panels)
		return res
			.status(400)
			.json({ error: { message: 'The "panels" query parameter is required' } })
	for (let i = 0; i < panels.length; i++) {
		if (!validPanels.includes(panels[i])) {
			return res.status(400).json({
				error: {
					message: 'The "panels" query parameter contains invalid values',
				},
			})
		}
	}

	//get how many custom lists there are
	let customListCount = 0
	for (const panel of panels) {
		if (panel.includes('customlist')) {
			customListCount++
		}
	}

	let customLists: customlist[] = []

	//if there are custom lists, get url params for them in interval like customlist1=, customlist2=, customlist3=
	if (customListCount > 0) {
		//get custom list url params
		for (let i = 1; i <= customListCount; i++) {
			const customList = req.query[`customlist${i}`]?.toString()
			if (!customList) {
				return res
					.status(400)
					.json({ error: { message: 'Invalid custom list' } })
			}

			customLists.push({
				items: customList.split(','),
			})
		}
	}

	const date = new Date()
	date.setMonth(date.getMonth() - 12)
	//query get all commits, issues, pullrequests and code reviews last 12 months
	const query = `query {
		user(login: "${username}") {
			contributionsCollection(from: "${date.toISOString()}", to: "${new Date().toISOString()}") {
			
				totalIssueContributions
						totalPullRequestContributions
						contributionCalendar {
							totalContributions
							weeks {
								contributionDays {
									contributionCount
									date
								}
							}
						}
				commitContributionsByRepository {
							repository {
								name
								stargazerCount
								languages(first: 3, orderBy: {field: SIZE, direction: DESC}) {
									edges {
										size
										node {
										color
										name
										id
										}
									}
								}
							}
						}
				}
			}
			}`

	//if panels includes toplanguages or toprepositories or userstatistics or commitgraph, get data from github api
	let resp = null
	const panelsToCheck = new Set([
		'toplanguages',
		'toprepositories',
		'userstatistics',
		'commitgraph',
	])

	if (panels.some((panel: any) => panelsToCheck.has(panel))) {
		const headers = { authorization: `token ${process.env.GITHUB_TOKEN}` }
		resp = await graphql(query, { headers }).catch((err: any) => {
			res.status(404).json({ error: { message: 'FETCH ERROR ' + err.message } })
		})
	}

	const rankings = {
		S: 1500,
		'A+': 1200,
		A: 800,
		'B+': 500,
		B: 300,
		C: 100,
		D: 50,
		E: 10,
		F: 0,
	}

	const ranking = (thisyear: number) => {
		const commits = thisyear || 0
		for (const [rank, threshold] of Object.entries(rankings)) {
			if (commits > threshold) return rank
		}
		return 'F'
	}

	if (panels!.includes('userstatistics')) {
		const resproot = resp.user.contributionsCollection
		const contributionDays: ContributionDay[] =
			resproot.contributionCalendar.weeks[
				resproot.contributionCalendar.weeks.length - 1
			].contributionDays
		const totalContributions = resproot.contributionCalendar.totalContributions
		const thisMonthAndWeekContributions: number = contributionDays.reduce(
			(a, b) => a + b.contributionCount,
			0
		)

		userData = {
			thisyear: totalContributions,
			thismonth: thisMonthAndWeekContributions,
			thisweek: thisMonthAndWeekContributions,
			pullrequests: resproot.totalPullRequestContributions,
			issues: resp.user.contributionsCollection.totalIssueContributions,
			ranking: ranking(totalContributions)!,
			progress: Math.min(
				Math.max(((totalContributions - 0) * (0 - 250)) / (1500 - 0) + 250, 0),
				250
			),
		}
	}

	if (panels?.includes('toplanguages')) {
		const repositories =
			resp.user.contributionsCollection.commitContributionsByRepository
		const languages: string[] = repositories.flatMap((repo: Repositories) =>
			repo.repository.languages.edges.map((lang) => lang.node.name)
		)
		const languageCount = languages.reduce(
			(acc: Record<string, number>, val: string) => {
				acc[val] = (acc[val] || 0) + 1
				return acc
			},
			{}
		)
		userData.toplang = Object.entries(languageCount)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 4)
	}

	if (panels?.includes('toprepositories')) {
		const topRepos: Repository[] =
			resp.user.contributionsCollection.commitContributionsByRepository
				.map((repo: Repositories) => ({
					name: repo.repository.name,
					stars: repo.repository.stargazerCount,
					languages: repo.repository.languages.edges.map(
						(edge) => edge.node.name
					),
				}))
				.sort(
					(repo1: Repository, repo2: Repository) => repo2.stars - repo1.stars
				)
				.slice(0, 4)

		userData.toprepos = topRepos
	}

	const contributionCalendar: ContributionCallendar =
		resp.user.contributionsCollection?.contributionCalendar
	if (contributionCalendar && contributionCalendar.weeks) {
		const contributions = contributionCalendar.weeks
			.slice(0, 52)
			.map((week) => {
				return week.contributionDays.reduce(
					(a, b) => a + b.contributionCount,
					0
				)
			})

		userData.commitgraph = [...contributions]
	}

	//This is just free data for now
	userData.username = username

	const svg = ReactDomServer.renderToString(
		container(userData, panelProps, panels!, customLists)
	)
	res.setHeader('Content-Type', 'image/svg+xml')
	// @ts-ignore
	res.send(svg)
}

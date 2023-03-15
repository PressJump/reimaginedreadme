import type { NextApiRequest, NextApiResponse } from 'next'
import ReactDomServer from 'react-dom/server'
import { container } from '../../../components'

const { graphql } = require('@octokit/graphql')

type UserData = {
	username?: string
	thisyear?: number
	thismonth?: number
	thisweek?: number
	pullrequests?: number
	issues?: number
	ranking?: string
	progress?: number
	toplang?: [string, unknown][]
	toprepos?: [string, unknown][]
	commitgraph?: number[]
}

type Data = {
	error?: {
		message: string
	}
}

type PanelProps = {
	color?: string
	titlecolor?: string
	textcolor?: string
	bgcolor?: string
}

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
	]

	if (!panels || panels.some((panel) => !validPanels.includes(panel))) {
		return res
			.status(400)
			.json({ error: { message: 'The "panels" query parameter is required' } })
	}

	const date = new Date()
	date.setMonth(date.getMonth() - 12)
	//query get all commits, issues, pullrequests and code reviews last 12 months
	const query = `query {
		user(login: "${username}") {
			contributionsCollection(from: "${date.toISOString()}", to: "${new Date().toISOString()}") {

			${
				panels.includes('userstatistics') || panels.includes('commitgraph')
					? `totalIssueContributions
					totalPullRequestContributions
					contributionCalendar {
						totalContributions
						weeks {
							contributionDays {
								contributionCount
								date
							}
						}
					}`
					: ''
			}	
			

			${
				panels.includes('toplanguages') || panels.includes('toprepositories')
					? `commitContributionsByRepository {
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
					}`
					: ''
			}
			

			}
		}
		}`

	const resp = await graphql(query, {
		headers: {
			authorization: `token ${process.env.GITHUB_TOKEN}`,
		},
	})
		.then((res: any) => res)
		.catch((err: any) => {
			res.status(404).json({
				error: {
					message: err.message,
				},
			})
		})

	const ranking = (thisyear: number) => {
		const commits = thisyear || 0
		if (commits > 1500) return 'S'
		if (commits > 1200) return 'A+'
		if (commits > 800) return 'A'
		if (commits > 500) return 'B+'
		if (commits > 300) return 'B'
		if (commits > 100) return 'C'
		if (commits > 50) return 'D'
	}

	//Set userData username

	if (panels!.includes('userstatistics')) {
		const resproot = resp.user.contributionsCollection
		userData = {
			thisyear: resproot.contributionCalendar.totalContributions,
			thismonth: resproot.contributionCalendar.weeks[
				resproot.contributionCalendar.weeks.length - 1
				// @ts-ignore
			].contributionDays.reduce((a, b) => a + b.contributionCount, 0),
			thisweek: resproot.contributionCalendar.weeks[
				resproot.contributionCalendar.weeks.length - 1
				// @ts-ignore
			].contributionDays.reduce((a, b) => a + b.contributionCount, 0),
			pullrequests: resproot.totalPullRequestContributions,
			issues: resp.user.contributionsCollection.totalIssueContributions,
			ranking: ranking(resproot.contributionCalendar.totalContributions)!,
			progress: Math.min(
				Math.max(
					((resproot.contributionCalendar.totalContributions - 0) * (0 - 250)) /
						(1500 - 0) +
						250,
					0
				),
				250
			),
		}
	}

	if (panels!.includes('toplanguages')) {
		const repositories =
			resp.user.contributionsCollection.commitContributionsByRepository
		const languages = repositories.map((repo: any) => {
			const lang = repo.repository.languages.edges.map((lang: any) => {
				return {
					name: lang.node.name,
				}
			})
			return lang
		})

		const languageCount = languages.reduce((acc: any, val: any) => {
			val.forEach((lang: any) => {
				acc[lang.name] = (acc[lang.name] || 0) + 1
			})
			return acc
		}, {})

		userData.toplang = Object.entries(languageCount)
			// @ts-ignore
			.sort((a, b) => b[1] - a[1])
			.slice(0, 4)
	}

	if (panels!.includes('toprepositories')) {
		const repositories =
			resp.user.contributionsCollection.commitContributionsByRepository
		const topRepos = repositories
			.map((repo: any) => {
				return {
					name: repo.repository.name,
					stars: repo.repository.stargazerCount,
				}
			})
			// @ts-ignore
			.sort((a, b) => b.stars - a.stars)
			.slice(0, 4)
		userData.toprepos = topRepos
	}

	if (panels!.includes('commitgraph')) {
		//Get count of contributions each month for the last 13 months
		const resproot = resp.user.contributionsCollection
		const weeks = resproot.contributionCalendar.weeks
		const contributions = weeks.map((week: any) => {
			const days = week.contributionDays
			return days.reduce((a: any, b: any) => a + b.contributionCount, 0)
		})
		userData.commitgraph = contributions
	}

	userData.username = username

	const svg = ReactDomServer.renderToString(
		container(userData, panelProps, panels!)
	)
	res.setHeader('Content-Type', 'image/svg+xml')
	// @ts-ignore
	res.send(svg)
}

import type { NextApiRequest, NextApiResponse } from 'next'
const { graphql } = require('@octokit/graphql')

type UserData = {
	thisyear: number
	thismonth: number
	thisweek: number
	pullrequests: number
	issues: number
}

type Data = {
	error?: {
		message: string
	}
	user?: {
		username: string
		thisyear: number
		thismonth: number
		thisweek: number
		pullrequests: number
		issues: number
		ranking: string
	}
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const username = req.query.username?.toString()

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
			}
		}
		}`

	//get data from github api using graphql query and token from env. If the user does not exist or somethign goes wrong send back 404
	const resp = await graphql(query, {
		headers: {
			authorization: `token ${process.env.GITHUB_TOKEN}`,
		},
	})
		.then((res: any) => res)
		.catch((err: any) => {
			res.status(404).json({
				error: {
					message: 'User not found',
				},
			})
		})

	const UserData: UserData = {
		thisyear:
			resp.user.contributionsCollection.contributionCalendar.totalContributions,
		thismonth: resp.user.contributionsCollection.contributionCalendar.weeks[
			resp.user.contributionsCollection.contributionCalendar.weeks.length - 1
		].contributionDays.reduce((a, b) => a + b.contributionCount, 0),
		thisweek: resp.user.contributionsCollection.contributionCalendar.weeks[
			resp.user.contributionsCollection.contributionCalendar.weeks.length - 1
		].contributionDays.reduce((a, b) => a + b.contributionCount, 0),
		pullrequests:
			resp.user.contributionsCollection.totalPullRequestContributions,
		issues: resp.user.contributionsCollection.totalIssueContributions,
	}

	//ranking of user from range D C B B+ A A+ S S+ dependant on the amount of commits from commit count range [0 - 3000]
	const ranking = () => {
		const commits = UserData.thisyear || 0
		if (commits < 50) return 'D'
		if (commits < 100) return 'C'
		if (commits < 300) return 'B'
		if (commits < 500) return 'B+'
		if (commits < 800) return 'A'
		if (commits < 1200) return 'A+'
		if (commits < 1700) return 'S'
		if (commits < 2500) return 'S+'
	}

	res.status(200).json({
		user: {
			username: username!,
			thisyear: UserData.thisyear,
			thismonth: UserData.thismonth,
			thisweek: UserData.thisweek,
			pullrequests: UserData.pullrequests,
			issues: UserData.issues,
			ranking: ranking()!,
		},
	})
}

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
	username: string
	thisyear: number
	thismonth: number
	thisweek: number
	pullrequests: number
	issues: number
	ranking: string
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	//get the time it was 12 months ago
	const date = new Date()
	date.setMonth(date.getMonth() - 12)
	//query get all commits, issues, pullrequests and code reviews last 12 months
	const query = `query {
		user(login: "PressJump") {
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

	const resp = await graphql(query, {
		headers: {
			authorization: `token ${process.env.GITHUB_TOKEN}`,
		},
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
		username: 'PressJump',
		thisyear: UserData.thisyear,
		thismonth: UserData.thismonth,
		thisweek: UserData.thisweek,
		pullrequests: UserData.pullrequests,
		issues: UserData.issues,
		ranking: ranking()!,
	})
}

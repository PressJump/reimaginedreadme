import type { NextApiRequest, NextApiResponse } from 'next'
const { graphql } = require('@octokit/graphql')

type UserData = {
	thisyear: number
	thismonth: number
	thisweek: number
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	//get the time it was 12 months ago
	const date = new Date()
	date.setMonth(date.getMonth() - 12)
	//get all commits from user PressJump
	const query = `query {
		user(login: "PressJump") {
			contributionsCollection(from: "${date.toISOString()}", to: "${new Date().toISOString()}") {
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
	}

	return res.status(200).json(UserData)
}

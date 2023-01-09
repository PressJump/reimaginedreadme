import type { NextApiRequest, NextApiResponse } from 'next'
const { graphql } = require('@octokit/graphql')

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
}

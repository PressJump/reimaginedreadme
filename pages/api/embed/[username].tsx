import type { NextApiRequest, NextApiResponse } from 'next'
import ReactDomServer from 'react-dom/server'
import { Userstatspanel, Usertoplangspanel } from '../../../components'

const { graphql } = require('@octokit/graphql')

type UserData = {
	thisyear: number
	thismonth: number
	thisweek: number
	pullrequests: number
	issues: number
	ranking: string
}

type Data = {
	error?: {
		message: string
	}
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')

	const username = req.query.username?.toString()
	const color = req.query.color?.toString()

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

	//ranking of user from range D C B B+ A A+ S S+ dependant on the amount of commits from commit count range [0 - 3000]
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

	const UserData: UserData = {
		thisyear:
			resp.user.contributionsCollection.contributionCalendar.totalContributions,
		thismonth: resp.user.contributionsCollection.contributionCalendar.weeks[
			resp.user.contributionsCollection.contributionCalendar.weeks.length - 1
			// @ts-ignore
		].contributionDays.reduce((a, b) => a + b.contributionCount, 0),
		thisweek: resp.user.contributionsCollection.contributionCalendar.weeks[
			resp.user.contributionsCollection.contributionCalendar.weeks.length - 1
			// @ts-ignore
		].contributionDays.reduce((a, b) => a + b.contributionCount, 0),
		pullrequests:
			resp.user.contributionsCollection.totalPullRequestContributions,
		issues: resp.user.contributionsCollection.totalIssueContributions,
		ranking: ranking(
			resp.user.contributionsCollection.contributionCalendar.totalContributions
		)!,
	}

	const commitRange = 1500 - 0
	const progressRange = 0 - 250
	const progress = ((UserData.thisyear - 0) * progressRange) / commitRange + 250
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

	const topLanguages = Object.entries(languageCount)
		// @ts-ignore
		.sort((a, b) => b[1] - a[1])
		.slice(0, 4)

	//SVG of GitHub Stats taken from https://github.com/LordDashMe/github-contribution-stats under MIT License
	//I really love the look of the embed and wanted to use it as a base line

	// ================================================================================

	//I promise this is only temp, this will be seperated into another file
	const style = `
				.title {
					font-family: 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', sans-serif;
					font-size: 20px;
					font-weight: 400;
					fill: #000;
					animation: fadeIn 0.8s ease-in-out forwards;
				}

				.item {
					opacity: 0;
					animation: fadeIn 0.3s ease-in-out forwards;
				}

				.contribution-stats {
					font-family: 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', sans-serif;
					font-weight: 400;
					font-size: 14px;
					fill: #333;
				}

				.remarks {
					font-size: 11px;
				}

				.updatetime {
					font-size: 8px;
				}

				.repo-origin {
					font-size: 10px;
				}

				.rating-letter-sign {
					font-family: 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', sans-serif;
					font-size: 38px;
					font-weight: 700;
					fill: #${color || 'eacb2f'};
					animation: scaleIn 0.3s ease-in-out forwards;
				}

				.rating-circle-stroke {
					stroke: #ababab;
					stroke-width: 7.5;
					fill: none;
					opacity: 0.2;
				}

				.rating-circle {
					stroke: #${color || 'eacb2f'};
					stroke-dasharray: 250;
					stroke-width: 7.5;
					stroke-linecap: round;
					fill: none;
					opacity: 0.8;
					transform-origin: -10px 8px;
					transform: rotate(-90deg);
					animation: ratingProgressAnimation 1s forwards ease-in-out;
				}

				.bolder {
					font-weight: 700;
					font-family: 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', sans-serif;
				}

				.link {
					font: bold;
					fill: rgb(0, 102, 255);
				}

				@keyframes scaleIn {
					from {
						transform: translate(-5px, 5px) scale(0);
					}
					to {
						transform: translate(-5px, 5px) scale(1);
					}
				}

				@keyframes fadeIn {
					from {
						opacity: 0;
					}
					to {
						opacity: 1;
					}
				}

				@keyframes ratingProgressAnimation {
					from {
						stroke-dashoffset: 250;
					}
					to {
						stroke-dashoffset: ${progress};
					}
				}`

	const svgimage = (
		<svg xmlns="http://www.w3.org/2000/svg" width="679" height="240">
			<style>${style}</style>
			<rect
				xmlns="http://www.w3.org/2000/svg"
				x="0.5"
				y="0.5"
				rx="12"
				width="679"
				height="100%"
				fill="#efefef"
				stroke="#e1e4e8"
			/>

			<Userstatspanel UserData={UserData} />

			{/* vertical line */}
			<svg xmlns="http://www.w3.org/2000/svg" x="0" y="0">
				<g className="item" transform="translate(0, 0)">
					<line
						x1="320"
						y1="40"
						x2="320"
						y2="200"
						style={{ stroke: '#ccc', strokeWidth: 2 }}
					/>
				</g>
			</svg>

			<Usertoplangspanel topLanguages={topLanguages} />

			<svg
				xmlns="http://www.w3.org/2000/svg"
				xmlnsXlink="http://www.w3.org/1999/xlink"
				x="0"
				y="200"
			>
				<g className="item" transform="translate(25, 15)">
					<text className="contribution-stats remarks" x="0" y="0">
						Do you like how this widget looks or want to show your GitHub
						Statistics?{' '}
						<a
							href="https://github.com/PressJump/reimaginedreadme"
							className="link"
						>
							Get it for yourself.
						</a>
					</text>
				</g>
			</svg>
		</svg>
	)
	const svg = ReactDomServer.renderToString(svgimage)
	res.setHeader('Content-Type', 'image/svg+xml')
	// @ts-ignore
	res.send(svg)
}

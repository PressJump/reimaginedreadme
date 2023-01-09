import type { NextApiRequest, NextApiResponse } from 'next'
//reactdomserver
import ReactDomServer from 'react-dom/server'

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

	//SVG of GitHub Stats taken from https://github.com/LordDashMe/github-contribution-stats under MIT License
	//I really love the look of the embed and wanted to use it as a base line

	// ================================================================================

	//I promise this is only temp, this will be seperated into another file
	const style = `
				.title {
					font-family: 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', sans-serif;
					font-size: 20px;
					font-weight: 700;
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

				.repo-origin {
					font-size: 10px;
				}

				.rating-letter-sign {
					font-family: 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', sans-serif;
					font-size: 38px;
					font-weight: 700;
					fill: #eacb2f;
					animation: scaleIn 0.3s ease-in-out forwards;
				}

				.rating-circle-stroke {
					stroke: #ababab;
					stroke-width: 7.5;
					fill: none;
					opacity: 0.2;
				}

				.rating-circle {
					stroke: #eacb2f;
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
						//This is where the magic happens
						stroke-dashoffset: 0;
					}
				}`

	const svgimage = (
		<svg xmlns="http://www.w3.org/2000/svg" width="679" height="265">
			<style>${style}</style>
			<rect
				xmlns="http://www.w3.org/2000/svg"
				x="0.5"
				y="0.5"
				rx="5"
				width="679"
				height="100%"
				fill="#efefef"
				stroke="#e1e4e8"
			/>
			<g
				xmlns="http://www.w3.org/2000/svg"
				id="ratings"
				transform="translate(265, 115)"
			>
				<circle className="rating-circle-stroke" cx="-10" cy="8" r="38" />
				<circle className="rating-circle" cx="-10" cy="8" r="38" />
				<text
					className="rating-letter-sign"
					x="-5"
					y="1.5"
					text-anchor="middle"
					alignment-baseline="central"
					dominant-baseline="central"
				>
					{ranking()}
				</text>
			</g>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				x="23"
				y="17"
				width="25px"
				height="25px"
				viewBox="0 0 50 50"
				fill="#000"
			>
				<g transform="scale(0.1)">
					<path d="M409.132,114.573c-19.608-33.596-46.205-60.194-79.798-79.8C295.736,15.166,259.057,5.365,219.271,5.365c-39.781,0-76.472,9.804-110.063,29.408c-33.596,19.605-60.192,46.204-79.8,79.8C9.803,148.168,0,184.854,0,224.63c0,47.78,13.94,90.745,41.827,128.906c27.884,38.164,63.906,64.572,108.063,79.227c5.14,0.954,8.945,0.283,11.419-1.996c2.475-2.282,3.711-5.14,3.711-8.562c0-0.571-0.049-5.708-0.144-15.417c-0.098-9.709-0.144-18.179-0.144-25.406l-6.567,1.136c-4.187,0.767-9.469,1.092-15.846,1c-6.374-0.089-12.991-0.757-19.842-1.999c-6.854-1.231-13.229-4.086-19.13-8.559c-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559c-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-0.951-2.568-2.098-3.711-3.429c-1.142-1.331-1.997-2.663-2.568-3.997c-0.572-1.335-0.098-2.43,1.427-3.289c1.525-0.859,4.281-1.276,8.28-1.276l5.708,0.853c3.807,0.763,8.516,3.042,14.133,6.851c5.614,3.806,10.229,8.754,13.846,14.842c4.38,7.806,9.657,13.754,15.846,17.847c6.184,4.093,12.419,6.136,18.699,6.136c6.28,0,11.704-0.476,16.274-1.423c4.565-0.952,8.848-2.383,12.847-4.285c1.713-12.758,6.377-22.559,13.988-29.41c-10.848-1.14-20.601-2.857-29.264-5.14c-8.658-2.286-17.605-5.996-26.835-11.14c-9.235-5.137-16.896-11.516-22.985-19.126c-6.09-7.614-11.088-17.61-14.987-29.979c-3.901-12.374-5.852-26.648-5.852-42.826c0-23.035,7.52-42.637,22.557-58.817c-7.044-17.318-6.379-36.732,1.997-58.24c5.52-1.715,13.706-0.428,24.554,3.853c10.85,4.283,18.794,7.952,23.84,10.994c5.046,3.041,9.089,5.618,12.135,7.708c17.705-4.947,35.976-7.421,54.818-7.421s37.117,2.474,54.823,7.421l10.849-6.849c7.419-4.57,16.18-8.758,26.262-12.565c10.088-3.805,17.802-4.853,23.134-3.138c8.562,21.509,9.325,40.922,2.279,58.24c15.036,16.18,22.559,35.787,22.559,58.817c0,16.178-1.958,30.497-5.853,42.966c-3.9,12.471-8.941,22.457-15.125,29.979c-6.191,7.521-13.901,13.85-23.131,18.986c-9.232,5.14-18.182,8.85-26.84,11.136c-8.662,2.286-18.415,4.004-29.263,5.146c9.894,8.562,14.842,22.077,14.842,40.539v60.237c0,3.422,1.19,6.279,3.572,8.562c2.379,2.279,6.136,2.95,11.276,1.995c44.163-14.653,80.185-41.062,108.068-79.226c27.88-38.161,41.825-81.126,41.825-128.906C438.536,184.851,428.728,148.168,409.132,114.573z" />
				</g>
			</svg>
			<text xmlns="http://www.w3.org/2000/svg" className="title" x="54" y="35">
				Contribution Stats
			</text>
			<svg xmlns="http://www.w3.org/2000/svg" x="30" y="50">
				<g className="item" transform="translate(3, 2)">
					<svg
						width="16"
						height="16"
						viewBox="0 0 16 16"
						version="1.1"
						aria-hidden="true"
					>
						<path
							fill-rule="evenodd"
							d="M1.643 3.143L.427 1.927A.25.25 0 000 2.104V5.75c0 .138.112.25.25.25h3.646a.25.25 0 00.177-.427L2.715 4.215a6.5 6.5 0 11-1.18 4.458.75.75 0 10-1.493.154 8.001 8.001 0 101.6-5.684zM7.75 4a.75.75 0 01.75.75v2.992l2.028.812a.75.75 0 01-.557 1.392l-2.5-1A.75.75 0 017 8.25v-3.5A.75.75 0 017.75 4z"
						/>
					</svg>
				</g>
				<g className="stagger" transform="translate(25, 15)">
					<text className="contribution-stats" x="0" y="0">
						Commits:
					</text>
				</g>
			</svg>
			<svg xmlns="http://www.w3.org/2000/svg" x="35" y="75">
				<g
					id="this_year_commits"
					className="item"
					transform="translate(25, 15)"
				>
					<text className="contribution-stats" x="0" y="0">
						This Year:
					</text>
					<text className="contribution-stats bolder" x="101" y="0">
						{UserData.thisyear}
					</text>
				</g>
				<g
					id="this_month_commits"
					className="item"
					transform="translate(25, 35)"
				>
					<text className="contribution-stats" x="0" y="5">
						This Month:
					</text>
					<text className="contribution-stats bolder" x="101" y="5">
						{UserData.thismonth}
					</text>
				</g>
				<g
					id="this_week_commits"
					className="item"
					transform="translate(25, 55)"
				>
					<text className="contribution-stats" x="0" y="10">
						This Week:
					</text>
					<text className="contribution-stats bolder" x="101" y="10">
						{UserData.thisweek}
					</text>
				</g>
			</svg>
			<svg xmlns="http://www.w3.org/2000/svg" x="30" y="150">
				<g className="item" transform="translate(3, 2)">
					<svg
						width="16"
						height="16"
						viewBox="0 0 16 16"
						version="1.1"
						aria-hidden="true"
					>
						<path
							fill-rule="evenodd"
							d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z"
						/>
					</svg>
				</g>
				<g id="pull_requests" className="item" transform="translate(25, 15)">
					<text className="contribution-stats" x="0" y="0">
						Pull Requests:
					</text>
					<text className="contribution-stats bolder" x="106" y="0">
						{UserData.pullrequests}
					</text>
				</g>
			</svg>
			<svg xmlns="http://www.w3.org/2000/svg" x="30" y="175">
				<g className="item" transform="translate(3, 2)">
					<svg
						width="16"
						height="16"
						viewBox="0 0 16 16"
						version="1.1"
						aria-hidden="true"
					>
						<path
							fill-rule="evenodd"
							d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm9 3a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z"
						/>
					</svg>
				</g>
				<g id="issues" className="item" transform="translate(25, 15)">
					<text className="contribution-stats" x="0" y="0">
						Issues:
					</text>
					<text className="contribution-stats bolder" x="106" y="0">
						{UserData.pullrequests}
					</text>
				</g>
			</svg>

			<svg xmlns="http://www.w3.org/2000/svg" x="-6" y="224">
				<g className="item" transform="translate(25, 15)">
					<text className="contribution-stats remarks" x="0" y="0">
						Remarks: The contributor stats score rating is Excellent!
					</text>
				</g>
			</svg>
		</svg>
	)
	const svg = ReactDomServer.renderToString(svgimage)
	res.setHeader('Content-Type', 'image/svg+xml')
	res.send(svg)
}

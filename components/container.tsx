import { stdout } from 'process'
import {
	Userstatspanel,
	Usertoplangspanel,
	Usertoprepositoriespanel,
	Usercommitgraph,
	Userwelcome,
} from '.'

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

type PanelProps = {
	color?: string
	titlecolor?: string
	textcolor?: string
	bgcolor?: string
}

type componentpos = {
	x: number
	y: number
}

type customlist = {
	items: string[]
}

export const container = (
	userData: UserData,
	panelProps: PanelProps,
	panels: string[],
	customLists: customlist[]
) => {
	//SVG of GitHub Stats taken from https://github.com/LordDashMe/github-contribution-stats under MIT License
	//I really love the look of the embed and wanted to use it as a base line

	// ================================================================================
	const style = `
        .title {
            font-family: 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', sans-serif;
            font-size: 20px;
            font-weight: 400;
            fill: #${panelProps.titlecolor ? panelProps.titlecolor : '000'};
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
            fill: #${panelProps.textcolor ? panelProps.textcolor : '333'};
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
            fill: #${panelProps.color ? panelProps.color : 'eacb2f'};
            animation: scaleIn 0.3s ease-in-out forwards;
        }

        .rating-circle-stroke {
            stroke: #ababab;
            stroke-width: 7.5;
            fill: none;
            opacity: 0.2;
        }

        .rating-circle {
            stroke: #${panelProps.color ? panelProps.color : 'eacb2f'};
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

		.bigtitle {
			font-size: 25px;
            font-weight: 400;
            fill: #${panelProps.titlecolor ? panelProps.titlecolor : '000'};
            animation: fadeIn 0.8s ease-in-out forwards;
			font-family: 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', sans-serif;
		}

        .link {
            font: bold;
            fill: rgb(0, 102, 255);
        }

		.graph {
			stroke: #${panelProps.color ? panelProps.color : 'eacb2f'};
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
                stroke-dashoffset: ${userData.progress?.toString()};
            }
        }`

	// ================================================================================
	let width = 0
	let height = 229
	let x = 0
	let y = 0
	const panelComponents: JSX.Element[] = []

	panels.forEach((panel) => {
		let panelComponent

		//if its less than 850 we just need to set the width
		if (x >= 890) {
			x = 0
			y += 229
			height += 229
			width = 890
		}

		x += 10

		switch (panel) {
			case 'userstatistics':
				panelComponent = (
					<Userstatspanel
						userData={userData}
						componentpos={{ x: Number(x.toString()), y: y }}
					/>
				)
				x += 310
				break
			case 'toplanguages':
				panelComponent = (
					<Usertoplangspanel
						topLanguages={userData.toplang!}
						componentpos={{ x: Number(x.toString()), y: y }}
					/>
				)
				x += 180
				break
			case 'toprepositories':
				panelComponent = (
					<Usertoprepositoriespanel
						topRepositories={userData.toprepos!}
						componentpos={{ x: Number(x.toString()), y: y }}
					/>
				)
				x += 180
				break
			case 'commitgraph':
				panelComponent = (
					<Usercommitgraph
						monthcontributions={userData.commitgraph!}
						componentpos={{ x: Number(x.toString()), y: y }}
					/>
				)
				x += 180
				break
			case 'userwelcome':
				panelComponent = (
					<Userwelcome
						username={userData.username || 'Username'}
						componentpos={{ x: Number(x.toString()), y: y }}
					/>
				)
				x += 890
				break
			default:
				return // handle unknown panels here
		}

		if (x > width) width = x

		panelComponents.push(panelComponent)

		if (x < 890) {
			// Insert a divider between panels
			panelComponents.push(
				<svg xmlns="http://www.w3.org/2000/svg" x="0" y="0">
					<g className="item" transform={`translate(${x}, ${y})`}>
						<line
							x1={0}
							y1="40"
							x2={0}
							y2="200"
							style={{ stroke: '#d9d9d9', strokeWidth: 1 }}
						/>
					</g>
				</svg>
			)
		}
	})

	return (
		<>
			<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
				<style>${style}</style>
				<rect
					xmlns="http://www.w3.org/2000/svg"
					x="0.5"
					y="0.5"
					rx="12"
					width={width - 1}
					height={height - 1}
					fill={panelProps.bgcolor ? `#${panelProps.bgcolor}` : '#efefef'}
					stroke="#e1e4e8"
				/>

				{panelComponents}

				{/* If the width is not 310 or more don't show this */}
				{width >= 310 && (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						xmlnsXlink="http://www.w3.org/1999/xlink"
						x="0"
						y="200"
					>
						<g className="item" transform="translate(25, 15)">
							<text className="contribution-stats remarks" x="0" y="0">
								Do you like how this widget looks?{' '}
								<a
									href="https://github.com/PressJump/reimaginedreadme"
									className="link"
								>
									Get it for yourself.
								</a>
							</text>
						</g>
					</svg>
				)}
			</svg>
		</>
	)
}

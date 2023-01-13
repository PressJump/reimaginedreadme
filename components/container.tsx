import { stdout } from 'process'
import { Userstatspanel, Usertoplangspanel, Usertoprepositoriespanel } from '.'

type UserData = {
	thisyear?: number
	thismonth?: number
	thisweek?: number
	pullrequests?: number
	issues?: number
	ranking?: string
	progress?: number
	toplang?: [string, unknown][]
	toprepos?: [string, unknown][]
}

type PanelProps = {
	color?: string
	titlecolor?: string
	textcolor?: string
	bgcolor?: string
}

export const container = (
	userData: UserData,
	panelProps: PanelProps,
	panels: string[]
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
                stroke-dashoffset: ${userData.progress?.toString()};
            }
        }`

	let width = 0

	let panelComponents: JSX.Element[] = []
	panels.forEach((panel) => {
		if (panel === 'userstatistics') {
			const panelComponent = (
				<Userstatspanel
					userData={userData}
					componentx={Number(width.toString())}
				/>
			)
			width += 310
			panelComponents.push(panelComponent)
		}

		if (panel === 'toplanguages') {
			const panelComponent = (
				<Usertoplangspanel
					topLanguages={userData.toplang!}
					componentx={Number(width.toString()) + 7}
				/>
			)
			width += 170
			panelComponents.push(panelComponent)
		}

		if (panel === 'toprepositories') {
			const panelComponent = (
				<Usertoprepositoriespanel
					topRepositories={userData.toprepos!}
					componentx={Number(width.toString()) + 7}
				/>
			)
			width += 180
			panelComponents.push(panelComponent)
		}

		//Insert a divider between panels
		panelComponents.push(
			<svg xmlns="http://www.w3.org/2000/svg" x="0" y="0">
				<g className="item" transform="translate(0, 0)">
					<line
						x1={width + 1}
						y1="40"
						x2={width + 1}
						y2="200"
						style={{ stroke: '#d9d9d9', strokeWidth: 1 }}
					/>
				</g>
			</svg>
		)
	})

	return (
		<>
			<svg xmlns="http://www.w3.org/2000/svg" width={width} height="230">
				<style>${style}</style>
				<rect
					xmlns="http://www.w3.org/2000/svg"
					x="0.5"
					y="0.5"
					rx="12"
					width={width}
					height="100%"
					fill={panelProps.bgcolor ? `#${panelProps.bgcolor}` : '#efefef'}
					stroke="#e1e4e8"
				/>

				{panelComponents}

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
			</svg>
		</>
	)
}

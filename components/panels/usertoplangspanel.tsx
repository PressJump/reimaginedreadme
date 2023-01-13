import Head from 'next/head'
import { type } from 'os'
import { devsvg } from '../../utils/devsvg'

export const Usertoplangspanel = ({
	topLanguages,
	componentx,
}: {
	topLanguages: [string, unknown][]
	componentx: number
}) => {
	console.log(topLanguages)
	return (
		<>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="25"
				height="25"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				x={componentx}
				y="17"
			>
				<polyline points="16 18 22 12 16 6"></polyline>
				<polyline points="8 6 2 12 8 18"></polyline>
			</svg>
			<text
				xmlns="http://www.w3.org/2000/svg"
				className="title bolder"
				x={componentx + 30}
				y="35"
			>
				Top Languages
			</text>

			{topLanguages.map((lang, index) => {
				return (
					<svg
						key={index}
						xmlns="http://www.w3.org/2000/svg"
						x={componentx + 10}
						y={index * 42 + 42}
					>
						<g className="item" transform="translate(3, 2)">
							{/*@ts-ignore*/}
							{devsvg[lang[0].toLowerCase()]}
						</g>
						<g id="toplangfirst" className="item" transform="translate(25, 35)">
							<text className="contribution-stats" x="15" y="-15">
								{lang[0]}
							</text>
						</g>
					</svg>
				)
			})}
		</>
	)
}

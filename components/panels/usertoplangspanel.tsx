import Head from 'next/head'

type MapType = {
	[key: string]: string
}

const whitelist: MapType = {
	html: 'html5',
	css: 'css3',
}

export const Usertoplangspanel = ({ topLanguages }: { topLanguages: JSON }) => {
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
				x="340"
				y="17"
			>
				<polyline points="16 18 22 12 16 6"></polyline>
				<polyline points="8 6 2 12 8 18"></polyline>
			</svg>
			<text xmlns="http://www.w3.org/2000/svg" className="title" x="370" y="35">
				Top Languages
			</text>

			<svg xmlns="http://www.w3.org/2000/svg" x="370" y="35">
				<g className="item" transform="translate(3, 2)">
					<image
						href={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${
							whitelist[topLanguages[0][0].toLowerCase()] ||
							topLanguages[0][0].toLowerCase()
						}/${
							(whitelist[topLanguages[0][0].toLowerCase()] ||
								topLanguages[0][0].toLowerCase()) + '-original.svg'
						}`}
						width="27"
						height="27"
						y="15"
					/>
				</g>
				<g id="toplangfirst" className="item" transform="translate(25, 35)">
					<text className="contribution-stats" x="15" y="0">
						{topLanguages[0][0]}
					</text>
				</g>
			</svg>
			<svg xmlns="http://www.w3.org/2000/svg" x="370" y="70">
				<g className="item" transform="translate(3, 2)">
					<image
						href={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${
							whitelist[topLanguages[1][0].toLowerCase()] ||
							topLanguages[1][0].toLowerCase()
						}/${
							(whitelist[topLanguages[1][0].toLowerCase()] ||
								topLanguages[1][0].toLowerCase()) + '-original.svg'
						}`}
						width="27"
						height="27"
						y="15"
					/>
				</g>
				<g id="toplangfirst" className="item" transform="translate(25, 35)">
					<text className="contribution-stats" x="15" y="0">
						{topLanguages[1][0]}
					</text>
				</g>
			</svg>
			<svg xmlns="http://www.w3.org/2000/svg" x="370" y="105">
				<g className="item" transform="translate(3, 2)">
					<image
						href={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${
							whitelist[topLanguages[2][0].toLowerCase()] ||
							topLanguages[2][0].toLowerCase()
						}/${
							(whitelist[topLanguages[2][0].toLowerCase()] ||
								topLanguages[2][0].toLowerCase()) + '-original.svg'
						}`}
						width="27"
						height="27"
						y="15"
					/>
				</g>
				<g id="toplangfirst" className="item" transform="translate(25, 35)">
					<text className="contribution-stats" x="15" y="0">
						{topLanguages[2][0]}
					</text>
				</g>
			</svg>
			<svg xmlns="http://www.w3.org/2000/svg" x="370" y="140">
				<g className="item" transform="translate(3, 2)">
					<image
						href={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${
							whitelist[topLanguages[3][0].toLowerCase()] ||
							topLanguages[3][0].toLowerCase()
						}/${
							(whitelist[topLanguages[3][0].toLowerCase()] ||
								topLanguages[3][0].toLowerCase()) + '-original.svg'
						}`}
						width="27"
						height="27"
						y="15"
					/>
				</g>
				<g id="toplangfirst" className="item" transform="translate(25, 35)">
					<text className="contribution-stats" x="15" y="0">
						{topLanguages[3][0]}
					</text>
				</g>
			</svg>
		</>
	)
}

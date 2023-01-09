import Head from 'next/head'

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
			<g id="toplangfirst" className="item" transform="translate(25, 35)">
				<text className="contribution-stats" x="370" y="35">
					{topLanguages[0][0]}
				</text>
			</g>
			<g id="toplangfirst" className="item" transform="translate(25, 35)">
				<text className="contribution-stats" x="370" y="70">
					{topLanguages[1][0]}
				</text>
			</g>
			<g id="toplangfirst" className="item" transform="translate(25, 35)">
				<text className="contribution-stats" x="370" y="105">
					{topLanguages[2][0]}
				</text>
			</g>
			<g id="toplangfirst" className="item" transform="translate(25, 35)">
				<text className="contribution-stats" x="370" y="140">
					{topLanguages[3][0]}
				</text>
			</g>
		</>
	)
}

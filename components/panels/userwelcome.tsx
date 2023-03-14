import Head from 'next/head'
import { type } from 'os'
import { devsvg } from '../../utils/devsvg'

export const Userwelcome = ({
	username,
	componentpos,
}: {
	username: string
	componentpos: { x: number; y: number }
}) => {
	return (
		<>
			{/* transform */}
			<g transform={`translate(${componentpos.x}, ${componentpos.y})`}>
				<text
					xmlns="http://www.w3.org/2000/svg"
					className="bigtitle"
					x={200}
					y="100"
				>
					👋 Welcome my name is {username}
				</text>
			</g>
		</>
	)
}

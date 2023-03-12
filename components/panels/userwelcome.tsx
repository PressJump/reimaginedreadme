import Head from 'next/head'
import { type } from 'os'
import { devsvg } from '../../utils/devsvg'

export const Userwelcome = ({
	username,
	componentx,
}: {
	username: string
	componentx: number
}) => {
	return (
		<>
			{/* transform */}
			<g transform={`translate(${componentx}, 0)`}>
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

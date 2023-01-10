import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
	return (
		<>
			This is not done yet but it will be soon. Visit{' '}
			<a href="https://github.com/PressJump/reimaginedreadme">
				https://github.com/PressJump/reimaginedreadme
			</a>{' '}
			for more info.
		</>
	)
}

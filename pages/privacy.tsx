import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import widgetpreview from '../public/svgwidgetpreview.svg'
import wizardhand from '../public/wizardhand.png'

const inter = Inter({ subsets: ['latin'] })

export default function Privacy() {
	return (
		<body className="bg-white dark:bg-neutral-900">
			<section className="bg-white dark:bg-neutral-900">
				<div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-8 lg:px-12">
					<h1 className="mb-4 font-extrabold text-4xl tracking-tight leading-none text-neutral-900 md:text-5xl lg:text-6xl dark:text-white">
						<nav className="flex" aria-label="Breadcrumb">
							<ol className="inline-flex items-center space-x-1 md:space-x-3">
								<li className="inline-flex items-center">
									<a
										href="./"
										className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
									>
										<svg
											aria-hidden="true"
											className="w-4 h-4 mr-2"
											fill="currentColor"
											viewBox="0 0 20 20"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
										</svg>
										Home
									</a>
								</li>
								<li>
									<div className="flex items-center">
										<svg
											aria-hidden="true"
											className="w-6 h-6 text-gray-400"
											fill="currentColor"
											viewBox="0 0 20 20"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												fill-rule="evenodd"
												d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
												clip-rule="evenodd"
											></path>
										</svg>
										<a
											href="./privacy"
											className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white"
										>
											Privacy Policy
										</a>
									</div>
								</li>
							</ol>
						</nav>
						Privacy{' '}
						<span className="font-block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
							Policy
						</span>
					</h1>
					<div className="mb-8 text-lg text-left font-normal text-neutral-500 lg:text-lg sm:px-16 xl:px-48 dark:text-neutral-400 flex flex-col gap-4">
						<p>
							At ReimaginedReadme, we take the privacy of our users seriously.
							Our website, hosted by Vercel, offers widgets for Github. This
							privacy policy outlines our data collection, usage and protection
							practices, including the types of information we collect, how it
							is used, and how it is protected.
						</p>
						<span className="font-extrabold text-2xl text-black">
							Information Collection:
						</span>
						<p>
							We collect personal information such as the GitHub username of the
							user and non-personal information such as the panels that the user
							selects to use within the widget. This information is used to
							provide our users with the service of displaying their own
							information as the widget and to avoid fetching information over
							and over again.
						</p>
						<span className="font-extrabold text-2xl text-black">
							Information Usage:
						</span>
						<p>
							The information collected is solely used to provide our users with
							the service of displaying their own information as the widget and
							is not shared or sold to any third parties.
						</p>
						<span className="font-extrabold text-2xl text-black">
							Information Protection:
						</span>
						<p>
							We take appropriate measures to protect the personal information
							that we cache and store. We use industry-standard security
							measures to ensure that your personal information is safe and
							secure. We also regularly review and update our security measures
							to ensure that they are up-to-date and effective.
						</p>
						<span className="font-extrabold text-2xl text-black">
							Third-Party Services:
						</span>
						<p>
							Please note that Vercel and Github may collect data on their own.
							For information on their data collection practices, please refer
							to their respective privacy policies.
							<ul className="list-disc py-6">
								<li>
									Vercel: Used for hosting the website and the widget.
									<a
										href="https://vercel.com/privacy"
										target="_blank"
										rel="noopener noreferrer"
										className="text-pink-600 hover:text-pink-700 px-2"
									>
										https://vercel.com/privacy
									</a>
								</li>
								<li>
									GitHub: Used for fetching the user's information.
									<a
										href="https://docs.github.com/en/github/site-policy/github-privacy-statement"
										target="_blank"
										rel="noopener noreferrer"
										className="text-pink-600 hover:text-pink-700 px-2"
									>
										https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement
									</a>
								</li>
							</ul>
							We have no control over the data collection practices of these
							third-party services and we are not responsible for their policies
							or actions.
						</p>
						<span className="font-extrabold text-2xl text-black">
							Policy Updates:
						</span>
						<p>
							This policy may be updated periodically to reflect any changes in
							our data collection practices. We will notify you of any
							significant changes to this policy by posting a notice on our
							website.
						</p>
						<span className="font-extrabold text-2xl text-black">
							Contact Us:
						</span>
						<p>
							If you have any questions or concerns about our privacy policy,
							please contact us. We will be happy to provide you with any
							additional information or clarification that you may need.
						</p>
						<p>
							By using our website and widgets, you consent to the collection
							and use of your personal information in accordance with this
							privacy policy. If you do not agree with the terms of this policy,
							please do not use our website.
						</p>
					</div>
				</div>
			</section>

			<footer className="p-4 flex items-center justify-center">
				<span className="text-sm px-2 text-gray-500 sm:text-center dark:text-gray-400">
					© 2023{' '}
					<a href="https://flowbite.com/" className="hover:underline">
						Reimagined Readme
					</a>
					. All Rights Reserved.
				</span>
				<ul className="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
					<li>
						<a href="./privacy" className="mr-4 hover:underline md:mr-6">
							Privacy Policy
						</a>
					</li>
					<li>
						<a
							href="https://github.com/PressJump/reimaginedreadme"
							className="hover:underline"
						>
							GitHub
						</a>
					</li>
				</ul>
			</footer>
		</body>
	)
}

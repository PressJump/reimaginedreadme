import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import widgetpreview from '../public/svgwidgetpreview.svg'
import wizardhand from '../public/wizardhand.png'
import { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
	const [column1, setColumn1] = useState([
		'/api/embed/pressjump?panels=userstatistics',
		'/api/embed/pressjump?panels=toprepositories',
		'/api/embed/pressjump?panels=toplanguages',
	])
	const [column2, setColumn2] = useState([])

	const handleDragStart = (e, index, column) => {
		e.dataTransfer.setData('index', index)
		e.dataTransfer.setData('column', column)
	}

	//Kill the hr if the user drags out of the droppable area
	const handleDragLeave = (e) => {
		const target = e.target.closest('.droppable')
		const hr = target.querySelector('.droppable-line')
		if (hr) {
			hr.remove()
		}
	}

	const handleDragOver = (e) => {
		e.preventDefault()

		const target = e.target.closest('.droppable')
		const items = target.querySelectorAll('.draggable')
		const mouseY = e.clientY

		const targetIndex = [...items].reduce(
			(closestIndex, child, index) => {
				const box = child.getBoundingClientRect()
				const offset = mouseY - box.top - box.height / 2

				if (offset < 0 && offset > closestIndex.offset) {
					return { offset, index }
				} else {
					return closestIndex
				}
			},
			{ offset: Number.NEGATIVE_INFINITY }
		).index

		//If there is a droppable-line, don't add another one
		if (target.querySelector('.droppable-line')) {
			return
		}

		const hr = document.createElement('hr')
		hr.classList.add('droppable-line')

		if (targetIndex === items.length) {
			target.appendChild(hr)
		} else {
			target.insertBefore(hr, items[targetIndex])
		}
	}

	const handleDrop = (e, targetColumn) => {
		const index = parseInt(e.dataTransfer.getData('index'))
		const sourceColumn = e.dataTransfer.getData('column')

		if (sourceColumn !== targetColumn) {
			const item = sourceColumn === 'column1' ? column1[index] : column2[index]

			if (!isItemInColumn(item, targetColumn)) {
				const sourceArray = sourceColumn === 'column1' ? column1 : column2
				const targetArray = targetColumn === 'column1' ? column1 : column2

				sourceArray.splice(index, 1)
				targetArray.splice(getTargetIndex(e), 0, item)

				setColumn1([...column1])
				setColumn2([...column2])
			}
		}

		const target = e.target.closest('.droppable')
		const hr = target.querySelector('.droppable-line')
		if (hr) {
			hr.remove()
		}
	}

	const isItemInColumn = (item, column) => {
		const columnArray = column === 'column1' ? column1 : column2
		return columnArray.includes(item)
	}

	const getTargetIndex = (e) => {
		const target = e.target.closest('.droppable')
		const items = target.querySelectorAll('.draggable')
		const mouseY = e.clientY
		let targetIndex = -1

		items.forEach((child, index) => {
			const box = child.getBoundingClientRect()
			const offset = mouseY - box.top - box.height / 2

			if (offset < 0 && targetIndex === -1) {
				targetIndex = index
			}
		})

		if (targetIndex === -1) {
			targetIndex = items.length
		}

		return targetIndex
	}
	return (
		<>
			<body className="bg-white dark:bg-neutral-900">
				{/* <Image
					src={wizardhand}
					alt="wizard hand"
					className="w-4/12 fixed right-20 top-2/4"
				/> */}
				<section className="bg-white dark:bg-neutral-900">
					<div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-8 lg:px-12">
						<a
							href="#"
							className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-neutral-700 bg-neutral-100 rounded-full dark:bg-neutral-800 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700"
							role="alert"
						>
							<span className="text-xs bg-primary-600 rounded-full text-white px-4 py-1.5 mr-3 bg-gradient-to-r from-purple-400 to-pink-600 font-extrabold">
								GitHub
							</span>{' '}
							<span className="text-sm font-medium">
								Checkout our new GitHub we are open source!
							</span>
							<svg
								className="ml-2 w-5 h-5"
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
						</a>
						<h1 className="mb-4 font-extrabold text-4xl tracking-tight leading-none text-neutral-900 md:text-5xl lg:text-6xl dark:text-white">
							Making your readme{' '}
							<span className="font-block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
								cool.
							</span>
						</h1>
						<p className="mb-8 text-lg font-normal text-neutral-500 lg:text-lg sm:px-16 xl:px-48 dark:text-neutral-400">
							Enhance your GitHub profile with our fully customizable readme
							widget and choose from a variety of blocks to showcase your top
							repos, recent activity, and more.
						</p>
						<div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
							{/* <a
								href="#"
								className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-neutral-900 rounded-lg border border-neutral-300 hover:bg-neutral-100 focus:ring-4 focus:ring-neutral-100 dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-700 dark:focus:ring-neutral-800"
							>
								Customize Readme
							</a> */}
						</div>
						<div className="px-4 mx-auto text-center md:max-w-screen-md lg:max-w-screen-lg lg:px-36">
							<div className="flex items-center justify-center ">
								<Image
									src={widgetpreview}
									alt="Widget Preview"
									className="undraggable"
									draggable="false"
								/>
							</div>
						</div>
					</div>
				</section>

				<section className="bg-white dark:bg-neutral-900">
					{/* Title */}
					<div className="text-center">
						<h1 className="text-3xl font-extrabold">
							Choose from a variety of blocks
						</h1>
						<p className="mb-8 text-lg font-normal text-neutral-500 lg:text-lg sm:px-16 xl:px-48 dark:text-neutral-400">
							We have a variety of blocks to choose from to make your readme
							stand out.
						</p>
					</div>

					<div className="flex flex-col items-center gap-2 w-50">
						<div
							className=" bg-neutral-100 rounded-xl w-4/12 h-40 p-2 flex gap-3 droppable"
							onDragOver={(e) => handleDragOver(e)}
							onDragLeave={(e) => handleDragLeave(e)}
							onDrop={(e) => handleDrop(e, 'column1')}
						>
							{column1.map((item, index) => (
								<div
									className="rounded-md transition duration-200 hover:scale-105 hover:cursor-pointer draggable"
									key={index}
									draggable
									onDragStart={(e) => handleDragStart(e, index, 'column1')}
								>
									<img src={item} className="h-36" />
								</div>
							))}
						</div>
						<div
							className=" bg-neutral-100 rounded-xl w-8/12 h-60 p-2 flex gap-4 droppable"
							onDragOver={(e) => handleDragOver(e)}
							onDragLeave={(e) => handleDragLeave(e)}
							onDrop={(e) => handleDrop(e, 'column2')}
						>
							{column2.map((item, index) => (
								<div
									className="rounded-md transition duration-200 hover:scale-105 hover:cursor-pointer draggable"
									key={index}
									draggable
									onDragStart={(e) => handleDragStart(e, index, 'column2')}
								>
									<img src={item} />
								</div>
							))}
						</div>
					</div>
				</section>

				<footer className="flex-col items-center justify-center">
					<div className="p-4 flex items-center justify-center">
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
					</div>

					<span className="flex items-center justify-center text-xs text-gray-500">
						<a href="https://www.freepik.com/free-photo/3d-wizard-hand-hold-magic-wand-with-golden-stars_32677829.htm#query=3d%20hand&position=37&from_view=author">
							Hand Image by upklyak
						</a>{' '}
						on Freepik
					</span>
				</footer>
			</body>
		</>
	)
}

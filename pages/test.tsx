import { useState } from 'react'

export default function Privacy() {
	const [column1, setColumn1] = useState(['Item 1', 'Item 2', 'Item 3'])
	const [column2, setColumn2] = useState(['Item 4', 'Item 5', 'Item 6'])

	const handleDragStart = (e, index, column) => {
		e.dataTransfer.setData('index', index)
		e.dataTransfer.setData('column', column)
	}

	const handleDragOver = (e) => {
		e.preventDefault()
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
	}

	const isItemInColumn = (item, column) => {
		const columnArray = column === 'column1' ? column1 : column2
		return columnArray.includes(item)
	}

	const getTargetIndex = (e) => {
		const target = e.target.closest('.droppable')
		const items = target.querySelectorAll('.draggable')
		const mouseY = e.clientY

		return [...items].reduce(
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
	}

	return (
		<div className="flex h-screen justify-center items-center">
			<div className="flex flex-row">
				<div
					className="flex flex-col items-center justify-center mx-4 border rounded-lg py-4 px-6 droppable"
					onDragOver={(e) => handleDragOver(e)}
					onDrop={(e) => handleDrop(e, 'column1')}
				>
					<h2 className="font-bold text-lg mb-4">Column 1</h2>
					{column1.map((item, index) => (
						<div
							className="border border-gray-300 rounded-md p-2 mb-2 cursor-move draggable"
							key={index}
							draggable
							onDragStart={(e) => handleDragStart(e, index, 'column1')}
						>
							{item}
						</div>
					))}
				</div>
				<div
					className="flex flex-col items-center justify-center mx-4 border rounded-lg py-4 px-6 droppable"
					onDragOver={(e) => handleDragOver(e)}
					onDrop={(e) => handleDrop(e, 'column2')}
				>
					<h2 className="font-bold text-lg mb-4">Column 2</h2>
					{column2.map((item, index) => (
						<div
							className="border border-gray-300 rounded-md p-2 mb-2 cursor-move draggable"
							key={index}
							draggable
							onDragStart={(e) => handleDragStart(e, index, 'column2')}
						>
							{item}
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

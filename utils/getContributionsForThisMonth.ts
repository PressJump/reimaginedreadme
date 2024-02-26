/**
 * Calculates the total contributions for the current month based on the provided contributions data.
 * @param contributions - An array of contributions data, each containing an array of contribution days with their counts and dates.
 * @returns The total number of contributions made in the current month.
 */
function getContributionsForThisMonth(
	contributions: {
		contributionDays: { contributionCount: number; date: string }[]
	}[]
) {
	const now = new Date()
	const currentMonth = now.getMonth()
	const currentYear = now.getFullYear()

	let totalContributionsThisMonth = 0

	// Get the last 4 weeks contributions because
	//we want to get the contributions for the current month which might span across 4 weeks
	const lastFourContributions = contributions.slice(-4)

	lastFourContributions.forEach((contribution) => {
		contribution.contributionDays.forEach((day) => {
			const contributionDate = new Date(day.date)
			if (
				contributionDate.getFullYear() === currentYear &&
				contributionDate.getMonth() === currentMonth
			) {
				totalContributionsThisMonth += day.contributionCount
			}
		})
	})

	return totalContributionsThisMonth
}

type UserData = {
	username?: string
	thisyear?: number
	thismonth?: number
	thisweek?: number
	pullrequests?: number
	issues?: number
	ranking?: string
	progress?: number
	toplang?: [string, number][]
	toprepos?: Repository[]
	commitgraph?: number[]
}

type ContributionCallendar = {
	totalContributions: number
	weeks: {
		contributionDays: {
			contributionCount: number
			date: string
		}[]
	}[]
}

type ContributionDay = {
	contributionCount: number
	date: string
}

type Repository = {
	name: string
	stars: number
}

type RepositoryDetails = {
	name: string
	stargazerCount: number
	languages: {
		edges: {
			size: number
			node: {
				color: string
				name: string
				id: string
			}
		}[]
	}
}

type Repositories = {
	repository: RepositoryDetails
}

type customlist = {
	items: string[]
}

type Data = {
	error?: {
		message: string
	}
}

type PanelProps = {
	color?: string
	titlecolor?: string
	textcolor?: string
	bgcolor?: string
}

export type {
	UserData,
	ContributionCallendar,
	Repository,
	RepositoryDetails,
	Repositories,
	customlist,
	Data,
	PanelProps,
	ContributionDay,
}

<div align="center">

<img width="120" src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/558ab792aec59eb639671d41c5666ef12f6d0d80/assets/Writing%20hand/Light/3D/writing_hand_3d_light.png"/>

## Deprecation Notice

Reimagined Readme is currently undergoing deprecation. Further information can be found at issue [#32](https://github.com/PressJump/reimaginedreadme/issues/32) regarding it. Thank you for your support.

## Reimagined Readme

GitHub readme widgets are too seperated and you need to add 4 different widgets with all different styles to show your GitHub statistics. **_Reimagined Readme_** tries to fix this problem by giving a layout to your readme that does not trigger OCD.

</div>

### Example Widget:

[![reimaginedreadme](https://myreadme.vercel.app/api/embed/pressjump?panels=userstatistics,toprepositories,toplanguages,commitgraph)](https://github.com/PressJump/reimaginedreadme)

## How to install

To create a custom widget we have a API route `https://myreadme.vercel.app/api/embed/YOURNAME` replacing yourname with well uh yourname.

#### Adding Widgets (Populating your Widget)

To populate your widget with your contribution stats, top repositories, or your commit graph you need to define which panels should be in the widget so you customize your own widget to your liking. We can do this through adding the url parameter panels `https://myreadme.vercel.app/api/embed/YOURNAME?panels=`. The order you put the panels is important as they will be reordered dependent on their size.

#### Valid Panels Include

- **userstatistics** - _(Commit data [Year, Month, Week], PRs, Issues)_

- **toprepositories** - _(Top starred repositories you own/have contributed to)_

- **toplanguages** - _(Your top languages ranked by amount of commits using them)_

- **commitgraph** - _(A graph of your commit engagement to GitHub)_

- **userwelcome** - _(A welcome text your profile)_

More panels will be added in the future, check issues for upcoming panels.

#### Using one panel only

Maybe a panel we have developed is superior and you want to add it to your GitHub profile but have other widgets from a different project. To do this, use the above steps but only include one panel in the panels list.

## Credits:

- **[github-contribution-stats](https://github.com/LordDashMe/github-contribution-stats)** [\[MIT\]](https://github.com/LordDashMe/github-contribution-stats/blob/master/LICENSE) - A SVG Based Github Contribution Stats Project (Used as base for SVG)

- **[devicon](https://github.com/devicons/devicon)** [\[MIT\]](https://github.com/devicons/devicon/blob/master/LICENSE) - Developer Icons (Used for Language Logos)

- **[Svelte Logo](https://github.com/sveltejs/branding/blob/master/svelte-logo.svg)** [\[Branding Guideline\]](https://github.com/sveltejs/branding/blob/master/README.md) - Utilized for identifying the Svelte language. (SvelteJS, along with its contributors and community are not affiliated with, sponsoring, or endorsing this project. For more information on Svelte's branding guidelines, visit their official repository.)

- **[R Logo](view-source:https://www.r-project.org/logo/Rlogo.svg)** [\[CC-BY-SA 4.0\]](https://creativecommons.org/licenses/by-sa/4.0/) - Utilized for identifying the R language. (The R Project and R Foundation, along with its contributors, has no association, sponsorship, or endorsement connection with this project. For further details on the R logo and its usage, please refer to their website and logo use guidelines which can be found [here](https://www.r-project.org/logo/).)

- **[FeatherIcons](https://github.com/feathericons/feather)** [\[MIT\]](https://github.com/feathericons/feather/blob/master/LICENSE) - Open Source Icons (Used for some icons on the widget)

- **[Fluent Emoji by Microsoft](https://github.com/microsoft/fluentui-emoji)** [\[MIT\]](https://github.com/microsoft/fluentui-emoji/blob/main/LICENSE) There is an [ongoing conversation](https://github.com/microsoft/fluentui-emoji/issues/18) regarding the license. - Modern Emoji's (Used as the logo)

- **[D3](https://github.com/d3/d3)** [\[ISC\]](https://github.com/d3/d3/blob/main/LICENSE) - Graphing SVG Path Logic (Used for Commit Graph)

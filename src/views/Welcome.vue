<template>
	<div id="welcome" class="view">
		<h1>Welcome to Zoomkitty!</h1>

		<p>Zoomkitty is a tool for turning Tabbycat draws into Zoom room pre-allocations, in order to speed up breakout room setup in debating competitions based around Zoom. The main caveat of this approach is that you can only really do one pre-allocation per Zoom meeting, so you would have to make a separate Zoom meeting per round.</p>

		<em>Tip: Click on the Zoomkitty icon to shrink the sidebar!</em>

		<h2>Using Zoomkitty</h2>
		<ol>
			<li>Import participant data into Zoomkitty</li>
			<li>Generate a draw in Tabbycat</li>
			<li>Import your draw into Zoomkitty</li>
			<li>Generate your Zoom allocation in Zoomkitty</li>
			<li>Upload the allocation to Zoom in the meeting scheduler by ticking the "Pre-allocate breakout rooms" box.</li>
		</ol>

		<h2>Importing Participants</h2>
		<p>Zoomkitty has two options for importing data, automatic import from Tabbycat (requires version >=2.4.0) or manual import from CSV files. CSV is a common export format for spreadsheets, which allows you to easily save an Excel or Google Sheets spreadsheet as a CSV, and then use it as your participant data source. You will have to select whether the imported sheet contains teams, judges or both, and then select the columns where the different pieces of data are.</p>

		<h2>Importing Draws</h2>
		<p>Zoomkitty supports importing the draw directly from Tabbycat (requires version >=2.4.0) or from a saved webpage from a Tabbycat site, which can be the public draw page or the venue display page (don't use the ordered by team page!). On Chrome or Firefox you can save a draw page by clicking Save, and picking the "Web Page, complete" option.</p>
	</div>
</template>

## Scorecard FAQ for Black Belts

In building towards a vision where core picking activities are integrated in one place, the Dan System is now also available on lpubelts.com. We hope Scorecard will become the official successor to the Dan Sheet but for now both systems are active and can be used for tracking your picks and projects as well as requesting Dan Levels through #belt-requests.

Worth noting: because the Dan Sheet cannont be actively connected to the Dan Sheet, changes in one place are not reflected in the other. It’s best to choose one or the other though of course you can keep both up-to-date. All of your lock and project additions can be made on lpubelts.com, and Dan Requests would reference your lpubelts.com Scorecard.

### Q: What is the Scorecard anyway?

Scorecard is a major overhaul of the “Recorded” list in LPUbelts collections. Instead of just keeping track of the locks you’ve recorded, you can now capture all the information used in the Dan Sheet. That includes: Lock, Date Picked, Link to Documentation, Modifiers (like First Recorded Pick), as well as Notes if you wish to add them.

Scorecard also implements the Dan scoring system for Black Belt pickers and calculates exact Dan Points based on locks with documentation, including modifiers and upgrades. Moving forward, you can use a link to your scorecard as evidence for Dan Level requests.

### Q: Why did you build it?

LPUbelts was originally built to directly address community needs, and we are always looking for ways to improve the LPU and lockpicking experience. The initial site (launched in Feb. 2022) was built to replace a static spreadsheet that was previously used to keep track of the Belt Ranking list. We had great success in migrating this static spreadsheet to a dynamic site, so that now LPUbelts has become the central source of a ton of lock information.

The success with the Belt Ranking list led us to look at other parts of the core picking experience to see what we could improve. We saw the Dan Sheet as an obvious area where there are a number of rough edges and errors, as well as a bunch of manual work needed to maintain it. Overall, we have made scoring locks and projects more intuitive to manage, more accurate, less prone to errors as locks are reclassified, more secure, and easier to maintain.

### Q: What are the advantages of Scorecard over the Dan Sheet?

There are a host of benefits, both for Black Belts and for the Mods who currently maintain the sheet.

- Leveraging all the features on lpubelts.com makes it much easier to find locks you want to add, with complete details.
- Point calculations are more accurate due to internal checks and verification.
- Upgrades are calculated automatically, eliminating the need for Black Belts to try to figure it out for themselves.
- Enhanced features not possible in a Google sheet (like sorting, searching and filtering on full lock data) are included.
- Integrated with the complete LPUbelts database, using Scorecard keeps more of our lock information in one place for easier and more reliable management & updates.
- Automatically updates with changes to lock rankings and additions.
- More privacy protections (contact an LPUbelts team member for more information).

### Q: Is the Scorecard acceptable as evidence for Dan Level requests?

Yes. Simply include a link to your scorecard in a standard Dan Level request. Paste this link into #belt-requests, so your post should look something like this:

`@LPUBeltBot request 8th Dan https://lpubelts.com/#/profile/[YourID]/scorecard`

The mods will receive your request, reviewing your Scorecard similar to how they previously reviewed your Google dan sheet. And they will respond just as before, in #belt-requests.

### Q: Do I need to create an account on LPUbelts to use it?

You do, just as you do to edit your Dan Sheet. You can use the exact same Google account as you do for the Dan Sheet if you don’t already have an LPUbelts profile.

### Q: How do I get my existing Dan Sheet record into the Scorecard?

It’s easy! We’ve built an automated import that does all the work for folks who have a tab in the Dan Sheet already. Simply hit the “Import Dan Sheet” button, identify your tab, and we’ll do the rest. Complete details can be found at https://lpubelts.com/#/profile/scorecard/howto

### Q: How do I add new entries to my Scorecard?

For new locks, find the lock on the lpubelts.com site, and click the “My Collection” button. There is a new checkbox for “Scorecard”. By checking this box, a form will appear where you can input all the information. Once you save this form, a new entry for this lock will appear on your Scorecard.

For new projects, go to the top of your Scorecard and click on the “Add Project” button. Similar to adding a new lock, a form will appear where you can input all the information. Once you save this form, your project will appear on your Scorecard.

### Q: Do changes to my Dan Sheet automatically show up on LPUbelts?

No. The Dan Sheet cannot be actively synced to the LPUbelts, because the Dan Sheet uses a separate classification approach that is not tightly connected to what the classification team manages. We took a snapshot of the Dan Sheet when we launched the Scorecard in August 2024, and the import works off of this snapshot. Any changes that you have made afterwards would need to be manually copied over after importing.

### Q:  Is the scoring identical?

We use the exact same scoring logic as the Dan sheet, including modifiers and upgrades. That said, some users may see a different total on the site if there are problems with their data that weren’t caught by the sheet. Please see the details in the next answer.

### Q: What are the main differences between the Dan Sheet & Scorecard scoring?

The main source of different scoring totals is “bad” data that the Dan Sheet simply can’t account for. These exceptions are clearly identified on the site: click the (?) icon next to your point totals to view a personalized breakdown. These are the reasons a lock in your Dan Sheet may not receive points on the site:

**Missing or bad URLs**. The Dan Sheet does not check the link you provide, not even that it is a valid URL. We do basic checks, though we obviously don’t evaluate the content of your links. These are easy to fix: just click on the lock to edit and add/fix the missing/bad link.

**Upgrades**. This is probably the biggest source of legitimately different points. We have a lock upgrade system, where locks with fewer elements, more mastered pins and such are upgraded by locks with more elements, etc. To date, it hasn’t been very clear which locks upgrade others, and the burden has been on black belt pickers to figure it out and use the “upgraded” modifier in their Google sheet so that only the points for the upgraded lock count. We now have a single source for upgrade data: click on [Upgrades list](https://lpubelts.com/#/profile/scorecard/upgrades) towards the top of your scorecard, just below your dan point total, to see it. It is automatically applied consistently to everyone. This is the first time anyone has attempted to pull together a concrete list, if you disagree with a particular upgrade pair, then please raise the issue with #lock-classification for further review.

**Duplicates**. Some locks are samelined into the same entry, and therefore only one will count for dan points. The Google dan sheet also did an accurate job of calculating this, so this should not result in different points. But it is called out here, to help explain how the math works.

**Could not match**. While the importer does a really good job overall, the lock classification that the dan sheets use is slightly different from the one in lpubelts.com. You may have a lock from your dan sheet that is too ambiguous to match clearly to the right entry in lpubelts.com. No worries, you just need to find that lock in lpubelts.com and add your video link and date manually. Other times the lock may not yet exist in lpubelts.com, because it has not yet been classified. Though this will never be the cause of a point difference, since such locks weren’t worth points there either.

### Q: Will I lose my Dan Level if the LPUbelts points total falls below the one I was already awarded?

No. Dan Levels are not revoked once they are approved unless major issues are discovered, just like Belt requests. There is no change here from how the Dan Sheet works.

### Q: Can I see how I rank against other Black Belts?

Yes! We’ve built several new features to allow for just that. The **[Black Belt Leaderboard](https://lpubelts.com/#/leaderboard/blackBelts)** lets you see how you fare with other Black Belts who are using the Scorecard. **[Compare Mode](https://lpubelts.com/#/leaderboard/blackBelts?compare=true)** allows you to match any two pickers against each other, just hit the blue button to play. Please note that you can opt out of the leaderboard and still use Scorecard, just reach out to the LPUbelts team.

### Q. Can I keep using the Dan Sheet?

Yes. We hope Scorecard will become the official successor to the Dan Sheet but for now both systems are active and can be used for tracking your picks and projects. Worth noting: because the Dan Sheet cannot be actively connected to LPUbelts, changes in one place are not reflected in the other. It’s best to choose one or the other though of course you can keep both up-to-date.

### Q: Can people who aren’t yet Black Belts use the Scorecard?

Sure! Any lock, even one that is not eligible for Dan Points, can be added by anyone who wants to keep track. The Scorecard will make the transition to Black Belt even easier for these people since their Dan-eligible locks will already be cataloged.

### Q: What if I don’t want to use lpubelts.com anymore, what happens to my data?

The data is yours. You can export it at any time in a variety of formats (use the download button at the bottom of the page). You can also delete all of your data from LPUbelts by visiting the [Edit Profile](https://lpubelts.com/#/profile/edit) page.

### Q: Is the Scorecard secure?

Yes. The site was built with the latest technology and all interactions are encrypted. The Google account you use to log in to the site is never displayed and no other personal details are available to us from Google. Logging we do to monitor the site is never connected to any of your personal data.

### Q: Will LPUbelts sell my data or otherwise profit from it?

**Absolutely not.** LPUbelts was created by folks from the lockpicking community, for the lockpicking community. You can find the details in our Privacy Policy: https://lpubelts.com/#/privacy

### Q: What are the plans for Scorecard in the future?

**Community happiness.** We built Scorecard to be both useful and enjoyable. It’s our hope that Scorecard will become the official successor to the Dan Sheet in the near future. In the meantime, we’re constantly working to make it even better. We’ve just launched a Black Belt Leaderboard and Compare Mode that lets you match up any two pickers. Our top priority is to get feedback from the community to improve LPUbelts so that it is something that everyone finds useful, safe and fun.

### You still haven’t answered my question!

There are many more additions in this big update, but please drop a note in **#belt-explorer** and the good folks on the Belt Explorer team will help you out! And of course, if you find something broken, please speak up in #belt-explorer so we can fix it.

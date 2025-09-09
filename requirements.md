## requirements
- this is a app built with vite + react + shadcn_ui to help coaches quickly and fairly create balanced teams during training sessions. The app allows coaches to maintain player data, rate performance, assign positions, and generate fair teams. It's designed to be offline-first, storing all data locally and no need for users to create a "profile". You can choose local database.

- user can create a team. Each team will have name, short description. Then you will be able to add players to the team.
When user have created a team, you can create players inside it. Players will have position(goalkeeper, defender, midfielder or forward) and also a rating(0 to 5 stars). User can create a team that have players with no rating though and is just used to split teams without rating consideration.

- The main functionality is then the team generator - where you take the group/team and split it. There user can filter if they want the split to take into consideration the position and rating of players(by default both is on).

-user can split into as many team as possible with minimun three players in each team.

- when user opens the app, a nice looking list of his teams is showed.

- the ui should be really minimalist, i really want to have this clean.

- follow best code practices, think about security and don't otver complicate things.
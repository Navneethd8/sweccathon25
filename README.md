# Ave Bingo (or Bingo on the Ave)!

## Inspiration

I had a lot of FOMO from missing out on the U District Food walk that happens in the fall and I decided take matters into my own hands and turned it into a game of mini bingo, which was something that I used to play a lot growing up.

## What it does

A Simple 3 x 3 bingo grid which gives 9 places on the Ave and allows users to check them out one by one using location based verifications through the google Maps API to retrieve all images and locations of places while comparing that to the user's location, bringing the need for users to actually visit those places to progress.
 
## How we built it
Used React with Next for the frontend with firebase firestore, storage and authentication for the backend.

Google Maps Places API to get the location logic done as well as retrieve the same pictures that were on google maps as well as next/geolocation to get the user location.

## Challenges we ran into
Working with dynamic routes for the place so as to create a scalable app for post mvp/hackathon development.

Working with location verification especially when developing from a single area. Also had a lot planned but had to make the difficult decision of scaling things down a lot.

## Accomplishments that we're proud of

Really proud of being able to motivate myself into getting things done especially since with a week long kind of hackathon, it is easier to lose motivation when obstacles are faced.

Development wise, really happy with how I was able to get the basics up and i'm really excited to bring the post mvp to life!

## What we learned

It is important to know your capabilities and scaffold and develop according to that otherwise you could feel like you let yourself down if you weren't able to achieve all of your goals in a limited time.

## What's next for Ave Bingo 

1.  Add more to gamified aspects of this 
-  A Mini character running up and down the screen on an a street view version of the ave live.
- Have firebase cloud functions do more async verification rather than a manual check in button adding to a more real life pokemon go kind of style.

2. Scale up locations to every restaurant on the ave and move on beyond restaurants and turn it into a one stop bingo for a non in state student to do during their 4 years at UW.

3. Add Rankings so that people can compete against each other

4. Dynamically add locations if users get to that 99% mark to ensure app retention.

5. Potentially release this to the UW student population.

6.  Utilize the Map API a lot more to get things like location ratings and reviews to make it more appealing to users to actually go to the places.

7. An image gallery where users can upload images/ selfies of them at the location and fill up any empty space.



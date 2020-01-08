# OurHealth App!

This is a web app that allows users to share alternative remedies with one another.

## Motivation

I built this app as a central hub and reliable storage place for online home remedies. Often I have to go searching on blogs, or ask through family what are the best remedies. Now home remedies can be shared from one spot!

## Link

https://our-health.johnnykessenich.now.sh/
github: https://github.com/jokessenich/our-health-server

## Screenshots

Home screen

![Home screen on PC](/readmePics/home.png "Home Screen")

Home Screen on Mobile Device

![Home screen on phone](/readmePics/homePhone.png "Home Screen on Mobile Device")


Browse Maladies Screen

![Browse Maladies Screen](/readmePics/maladiesPhone.png "Browse Maladies Screen")

Sample Malady Screen

![Sample Malady Screen](/readmePics/anxietyPhone.png "Sample Malady Screen")




## Summary

A user can search for an illness/malady in the home search bar or click the button to browse all maladies. The user may also register and login to give remedies a thumbs up/thumbs down.

## Endpoints


GET

Maladies:
/maladies - Gets all maladies
/maladies/:id- finds a malady by id

Remedies:
/remedies- Gets all remedies
/remedies/remedy/:id- Gets remedy with specified ID

Likes:
/likes- Gets all likes
/likes/:token- Gets likes for the specified user based on token


POST

Maladies: 
/maladies/add/:token- Adds a malady, provided a valid credential (body must include malady_name, malady_symptoms, and malady_description)

Remedies:
/remedies/add/:token- Adds a remedy provided a valid credential (body must include valid remedy_name, remedy_description, remedy_reference, remedy_malady, userid)

Users:
/users/register- Registers with a valide username, email and password
/users/login- Logs in and responds with a token



PATCH

Maladies:
/maladies/:id -patches malady with given id (request body must include malady_name, malady_symptoms, or malady_description)

Remedies:
/remedies/remedy/:id- Patches the specified remedy


DELETE

Maladies:
/maladies/:id- deletes malady with id

Remedies:
/remedies/remedy/:id- Patches the specified remedy


## Technology used

The API uses node, express, knex, mocha, chai and postgresSql.


'use strict';


// Variables to be obtained by code initializer
var searchKeyword = "Ra"
var searchKeywordEnd = searchKeyword + "\uf8ff"
var userID = "Sd4DAT2Ffsa5MuFF7aFSWMOImFu1"

//Import Modules
var events = require('events');
var firebase = require('firebase');


// Global variables for event loop
var foundUsers = []
var countOfFriends = 0
var friendsProcessed = 0
var friendsOfFriends = []
var fofMutual = [] // [[MutualFriends]]
var fofCount = [] // [CountOfMutualFriends]

// Create event emitter
var eventEmitter = new events.EventEmitter();


// Authenticate with Firebase

firebase.initializeApp({
	serviceAccount: {
  "type": "service_account",
  "project_id": "buzzlink-198ba",
  "private_key_id": "936fde1ed43615244b7cd9ff4541c2b7418fdd38",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCeewpQKRdiiv1m\n74Oh76G2AcfuFogO9K2tWX78q6cfFDi8s0kA7NYVlnt9W7K296Ftz72gggSCA7MC\npXzT22N5pXyX5nKrg+/bd6dWMTh+tb4YFKvaIC8lTTSFyBwW6hw+jI4FvhMpFKe4\n9w16quTmrmNmH4zhpUDS7IkURmJUviWxMz9eJIRyTgIK2VbIoCxWPTqAhFs8BG4M\nDAgAKqSUjv5Ic/pX4ePJygvU0NVGfiWLc/chljQCQC4QqG/8kQ0E2WTPmrQ9nfdO\nDWms1MZvtIgU9gNjORA018Cm33m+hQEaxBi8MrW3JTkxrDO27jx/NJqz+dSxrgsC\nSZO7CO4dAgMBAAECggEAIOsz2DTA28I9Ip2LvR5We8Tg746Ukm62iLR3USqimy0L\nH/8podyQF4nbes2KUMEdMf8dx3JaV1tHWrxfMm52ujTqrW670O6l6vNuudOdhYxg\nwQXCMJvQzzG7QDKxyvy0AzYU5hJ2Tmkw8ZW3ogxPYa9FjFfvXouB7I4fZyu7jxhg\ncwCRPYUdRO8ffnQkgQXj3vRKMF4JVXcqL8a5v3nKtotkngk4zsdCM9KdQTJrc6ge\nCYza/VAdvAEXXGp9h12aFwa1/PXNWaxIVN0kzgDVkN3dy2hwYegxqIS4Mx3+JT0T\n1ihxM+iF2t0mYVh8YN6A80k7OMyTRTokFu6ElH2XTQKBgQDLrhljUo15NEp6sT12\nejnacOC7kzZzDroVidKFEuVehU54oPW+U9wfdlODgr7oo8jyKuIhlSnECoKZx+UV\nHRVmNnv/6YCx6rzyPpRDZzjs3RoPF/U6dPWrUKgTjv+DmtBGSoGaQaXdXXTYYeBT\nrK/IfxYQFVxY1c1/v9E1H8OrzwKBgQDHMKXTITqBeMrlqvfy8H8Des5XiSkXXpIF\nLrEpS7iCs39scl7VBIdueiZE2Y0lG3KUEBV7UPosh1yhNoF2Gytcs06wG8H+RYiw\no7ovcj28d6DMMp0Bresqp+0XSpItQRN4gC4yMmEu3g+pTDw5h2p69mS22YSaTw2r\n3fsO+9CmUwKBgCb6lIU7gTOW3EIKtVZ9IaE6ROfgzmTKhrYkgBNTgG3MWS4gr6bS\n6adjv6vFU7+1yHj/1/LRVwLbeA7yAFdAD55WAvkAuM5TvAEoFLupf21lCt2kmhur\n0nAMqX3EugV3lTA+hfr9YT6x6fCXGpUo0SMvnwtI6zldAUzXarQd9hZlAoGBAJJZ\nDMzlkg3ESRabGdeVmUxeMzKfZOB1rEVAfAvCRYtKBGoSUdiinjquZmWZjZlg5Dsi\n4hWbdmO3BHiyCkZTSfWvDDZZ/psqTXaypL3taqyJHExLN44fUTQi8xB0ypeTQ5H6\nY3agC0UbBFi32VvPQY2ccHzjrgiN4paO3sGwhClfAoGAOAQbAwzQdwcW9K9fYNP1\nupvJwnlzKmiR/btlpSfsnoKkUEhkEKulPDBS9gErMlMi+jlTwSjqR9qg7xMBFrY6\nrfWHyPp+U6ljTuIK0vyr6rPRxCyORRUNTz/xhtQwkdGh8HatejK/189VIEoDxHwh\nzhjOensHvWlgGAscjwNBUc4=\n-----END PRIVATE KEY-----\n",
  "client_email": "compute@buzzlink-198ba.iam.gserviceaccount.com",
  "client_id": "100386996739550477821",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://accounts.google.com/o/oauth2/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/compute%40buzzlink-198ba.iam.gserviceaccount.com"
	},
	databaseURL: "https://buzzlink-198ba.firebaseio.com/"
});

// Authenticate Client


// Find Keywords Matching the Reference
var db = firebase.database();
var searchKeywordsRef = db.ref("searchKeywords")


console.time('FirstPull')
searchKeywordsRef.orderByKey().startAt(searchKeyword).endAt(searchKeywordEnd).once("value").then( function(searchKeywordsSnap) {
	console.timeEnd('FirstPull')

	console.log("Search keywords JSON");
	console.log(searchKeywordsSnap.val());
	if (searchKeywordsSnap.val() == null) {
		process.exit()
	}

	// First go through "Active" keyword searches by the user and see if any of the existing search results match

	// A1 Extract users matching keyword [MatchingUID]
		var searchKeywordsObject = searchKeywordsSnap.val()
		var searchKeywords = Object.keys(searchKeywordsObject)
		searchKeywords.forEach(function(key){
			 var addUser = Object.keys(searchKeywordsObject[key])[0]
			if (foundUsers.indexOf(addUser) == -1 && addUser != userID) {
				foundUsers.push(addUser);
			}
		})

		console.log("Found users for search keyword after suppressing self");
		console.log(foundUsers);

	console.time('SecondPull')
	// Suppress users for whom you already have a card 
	db.ref("/users/" + userID + "/cardAccess/").once("value", function(friendCardsSnap) {
		console.timeEnd('SecondPull')
		var friendCards = Object.keys(friendCardsSnap.val())

		countOfFriends = friendCards.length

		console.log("UIDs of friends")
		console.log(friendCards);
		friendCards.forEach(function(friend) {
			var indexOfFriend = foundUsers.indexOf(friend)
			if (indexOfFriend != -1) {
				foundUsers.splice(indexOfFriend, 1)
			}
		})

		console.log("Found users after suppressing friends")
		console.log (foundUsers);


		// A2a Retrieve friends of friends [FriendOfFriendUID : [FriendUID]], A2b [FriendOfFriendUID : Count]

		eventEmitter.on('Retrieved Friends Of Friends', friendsOfFriendsRetrieved)

		friendCards.forEach(function(friendUID) {
			console.time('Third pull')
			db.ref("/users/" + friendUID + "/cardAccess/").once("value", function(friendsOfFriendSnap) {
				var fofs = Object.keys(friendsOfFriendSnap.val())

				if (fofs != null) {
					// If friend of friend is not a friend and is not yourself then add to array
					fofs.forEach( function (fof) {
						if (friendCards.indexOf(fof) == -1 && fof != userID) {
							var indexOfFOF = friendsOfFriends.indexOf(fof)
							if (indexOfFOF == -1) {
								// New Friend of Friends
								friendsOfFriends.push(fof)
								fofMutual.push([friendUID])
								fofCount.push(1)
							}
							else {
								// Existing FOF 
								var existingMutual = fofMutual[indexOfFOF]
								existingMutual.push(friendUID)
								fofMutual[indexOfFOF] = existingMutual
								fofCount[indexOfFOF] += 1

							}
						}
					})
				}
				friendsProcessed += 1
				eventEmitter.emit('Retrieved Friends Of Friends')
				//friendsOfFriends.push()
			})
		})



	});

});

var friendsOfFriendsRetrieved  = function() {
	console.log("Event Fired")
	if (friendsProcessed == countOfFriends) {
		console.timeEnd('Third pull')
		console.log("Friends of Friends")
		console.log(friendsOfFriends)
		console.log("Mutual Friends with FOF")
		console.log(fofMutual)
		console.log("Count of Mutual Friends with FOF")
		console.log(fofCount)

		// For each friend of friend, check if he is in A1 and add to A3 in descending order of count of mutual, remove from A1

		// A3: [SearchedUID] [CountMutualFriends : [MutualFriends]]

		// For each SearchedUID, extract hasProfilePicture : A4 [[hasProfilePicture: Bool]]

		// Also output A5 [MatchingKeyword] [Name]

		// Update A3 and A4 and A5

		// Get location of user

		// Get location of all users in A1. Rank order users in descending order of proximity, return first 100
		

	}


};

// Asynchronous kill switch triggered by search ended delegate on client or timeout



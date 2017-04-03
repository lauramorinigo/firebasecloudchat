/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// TODO(DEVELOPER): Import the Cloud Functions for Firebase and the Firebase Admin modules here.

const functions = require('firebase-functions');
const admin     = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.addWelcomeMessages = functions.auth.user().onCreate(event=>{
  const user = event.data;
  console.log('Un usuario nuevo se logueó');
  const fullName = user.displayName || 'Anonimo';

  return admin.database().ref('messages').push({
    name: 'Firebase bot',
    photoUrl: '/images/firebase-logo.png', // Firebase logo
    texto: `${fullName} signed in for the first time! Welcome!`
  });

})


// TODO(DEVELOPER): Write the addWelcomeMessages Function here.

// TODO(DEVELOPER): Write the blurOffensiveImages Function here.

// TODO(DEVELOPER): Write the sendNotifications Function here.

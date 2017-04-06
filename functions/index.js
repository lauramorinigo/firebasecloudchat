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



// TODO(DEVELOPER): Write the addWelcomeMessages Function here.
exports.addWelcomeMessages = functions.auth.user().onCreate(event=>{
  const user = event.data;
  console.log('Un usuario nuevo se logueó');
  const fullName = user.displayName || 'Anonimo';

  return admin.database().ref('messages').push({
    name: 'Firebase bot',
    photoUrl: '/images/firebase-logo.png', // Firebase logo
    text: `${fullName} se conectó por primera vez. Bienvenido!`
  });

})


// TODO(DEVELOPER): Write the blurOffensiveImages Function here.

// TODO(DEVELOPER): Write the sendNotifications Function here.

exports.sendNotifications = functions.database.ref('messages/{messageId}').onWrite(event=>{
    const snapshot = event.data;

    /*Solo mandamos si el msj se creó*/
    if(snapshot.previous.val()){
      return;
    }

    /*Valores del msj*/

    const text= snapshot.val().text;
    const payload = {
      notification: {
        title: `${snapshot.val().name} posteó ${text ? 'un mensaje' : 'una imagen'}`,
        body: text ? (text.length <= 100 ? text : text.substring(0, 97) + '...') : '',
        icon: snapshot.val().photoUrl || '/images/profile_placeholder.png',
        click_action: `https://${functions.config().firebase.authDomain}`
      }
    }

    return admin.database().ref('fcmTokens').once('value').then(allTokens=>{
        if(allTokens.val()){
          const tokens = Object.keys(allTokens.val());

          return admin.messaging().sendToDevice(tokens, payload).then(response=>{
            const tokensToRemove = [];
            response.results.forEach((result, index)=>{
                const error = result.error;

                if(error){
                  console.error('Error al mandar el token', tokens[index], error);
                   // Limpiar los tokens que no se usan
                   if (error.code === 'messaging/invalid-registration-token' ||
                       error.code === 'messaging/registration-token-not-registered') {

                         tokensToRemove.push(allTokens.ref.child(tokens[index]).remove());
                   }
                }
            })
             return Promise.all(tokensToRemove);
          })
        }
      })
})

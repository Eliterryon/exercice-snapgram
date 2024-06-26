import React from 'react'
import { ID, Query } from "appwrite"
import { appwriteConfig, databases } from '@/lib/appwrite/config';

const profile = () => {

      let promise = databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [
            Query.equal('title', 'Hamlet')
        ]
    );

    promise.then(function (response) {
        console.log(response);
    }, function (error) {
        console.log(error);
    });
    return (
        <div>profile</div>
    )
}

export default profile
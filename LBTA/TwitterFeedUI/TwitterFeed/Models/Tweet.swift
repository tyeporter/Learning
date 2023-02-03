//
//  Tweet.swift
//  TwitterFeed
//
//  Created by Tye Porter on 1/19/19.
//  Copyright © 2019 Tye Porter. All rights reserved.
//

import Foundation

struct Tweet {
    let user: User
    let tweet: String
    
    init(user: User, tweet: String) {
        self.user = user
        self.tweet = tweet
    }
    
    init(withDictionary dictionary: [String: Any]){
        let userDictionary = dictionary["user"] as? [String: Any]
        self.user = User(withDictionary: userDictionary ?? [String: Any]())
        self.tweet = dictionary["message"] as? String ?? ""
    }
}

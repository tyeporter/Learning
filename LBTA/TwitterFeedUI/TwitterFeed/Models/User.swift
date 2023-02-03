//
//  User.swift
//  TwitterFeed
//
//  Created by Tye Porter on 1/18/19.
//  Copyright © 2019 Tye Porter. All rights reserved.
//

import Foundation

struct User {
    let name: String
    let username: String
    let bioText: String
    let profileImageName: String
    
    init(name: String, username: String, bioText: String, profileImageName: String) {
        self.name = name
        self.username = username
        self.bioText = bioText
        self.profileImageName = profileImageName
    }
    
    init(withDictionary dictionary: [String: Any]){
        self.name = dictionary["name"] as? String ?? ""
        self.username = dictionary["username"] as? String ?? ""
        self.bioText = dictionary["bio"] as? String ?? ""
        self.profileImageName = dictionary["profileImageUrl"] as? String ?? ""
    }
}

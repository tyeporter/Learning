//
//  User.swift
//  FireChat
//
//  Created by Tye Porter on 1/20/19.
//  Copyright © 2019 Tye Porter. All rights reserved.
//

import Foundation

struct User {
    let id: String
    let name: String
    let email: String
    var profileImageUrl: String?
    
    
    init(id: String, name: String, email: String) {
        self.id = id
        self.name = name
        self.email = email
    }
}

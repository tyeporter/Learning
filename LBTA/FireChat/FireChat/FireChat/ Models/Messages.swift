//
//  Messages.swift
//  FireChat
//
//  Created by Tye Porter on 1/23/19.
//  Copyright © 2019 Tye Porter. All rights reserved.
//

import Foundation
import FirebaseAuth
import FirebaseDatabase

class Message {
    let fromId: String
    let toId: String
    let text: String
    let timestamp: String
    var messengerName: String?
    var messageImageUrl: String?
    var messageImageWidth: Double?
    var messageImageHeight: Double?
    
    init(fromId: String, toId: String, text: String, timestamp: String) {
        self.fromId = fromId
        self.toId = toId
        self.text = text
        self.timestamp = timestamp
    }
    
    func chatPartnerId() -> String? {
        let uid = Auth.auth().currentUser?.uid
        return self.fromId == uid ? self.toId : self.fromId
    }
}

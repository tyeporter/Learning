//
//  HomeDataSource.swift
//  TwitterFeed
//
//  Created by Tye Porter on 1/17/19.
//  Copyright © 2019 Tye Porter. All rights reserved.
//

import LBTAComponents

class HomeDataSource: Datasource {
    
    var users: [User] = [
        User(name: "Tye Porter",
             username: "@tyeporter1",
             bioText: "Mobile Developer 📱",
             profileImageName: "me_profile"),
    ]
    
    var tweets: [Tweet] = [
        Tweet(user: User(name: "Steve Jobs",
                         username: "@jobs",
                         bioText: "",
                         profileImageName: "me_profile"),
            tweet: "Sometimes when you innovate, you make mistakes. It is best to admit them quickly, and get on with improving your other innovations."),
        
    ]
        
    override func headerClasses() -> [DatasourceCell.Type]? {
        return [UserHeader.self]
    }
    
    override func footerClasses() -> [DatasourceCell.Type]? {
        return [UserFooter.self]
    }
    
    override func numberOfSections() -> Int {
        return 2
    }
    
    override func numberOfItems(_ section: Int) -> Int {
        if section == 1 {
            return self.tweets.count
        }
        return self.users.count
    }
    
    override func item(_ indexPath: IndexPath) -> Any? {
        if indexPath.section == 1 {
            return self.tweets[indexPath.item]
        }
        return self.users[indexPath.item]
    }
    
    override func cellClasses() -> [DatasourceCell.Type] {
        return [UserCell.self, TweetCell.self]
    }
    
}

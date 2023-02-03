//
//  UserHeader.swift
//  TwitterFeed
//
//  Created by Tye Porter on 1/17/19.
//  Copyright © 2019 Tye Porter. All rights reserved.
//

import LBTAComponents

class UserHeader: DatasourceCell {
    
    let textLabel: UILabel = {
        let label = UILabel()
        label.text = "WHO TO FOLLOW"
        label.font = UIFont.systemFont(ofSize: 16)
        return label
    }()
    
    override func setupViews() {
        super.setupViews()
        self.backgroundColor = UIColor.white
        self.separatorLineView.isHidden = false
        self.separatorLineView.backgroundColor = UIColor.rgb(red: 230, green: 230, blue: 230)

        self.addSubview(self.textLabel)
        self.textLabel.anchor(width: 0, height: 0, top: nil, bottom: nil, left: self.leftAnchor, right: self.rightAnchor, paddingTop: 0, paddingBottom: 0, paddingLeft: 12, paddingRight: 12, centerX: nil, centerY: self.centerYAnchor, offsetX: 0, offsetY: 0)
        
    }
}

class UserFooter: DatasourceCell {
    
    let showMeMoreButton: UIButton = {
        let button = UIButton()
        let twitterBlueColor = UIColor.rgb(red: 61, green: 167, blue: 244)
        button.setTitle("Show me more", for: UIControl.State.normal)
        button.setTitleColor(twitterBlueColor, for: UIControl.State.normal)
        button.titleLabel?.font = UIFont.systemFont(ofSize: 15)
        button.contentHorizontalAlignment = UIControl.ContentHorizontalAlignment.left
        return button
    }()
    
    override func setupViews() {
        super.setupViews()
        self.backgroundColor = UIColor.white
        
        self.addSubview(self.showMeMoreButton)
        self.showMeMoreButton.anchor(width: 0, height: 0, top: self.topAnchor, bottom: self.bottomAnchor, left: self.leftAnchor, right: self.rightAnchor, paddingTop: 0, paddingBottom: 0, paddingLeft: 12, paddingRight: 12, centerX: nil, centerY: nil, offsetX: 0, offsetY: 0)
    }
}

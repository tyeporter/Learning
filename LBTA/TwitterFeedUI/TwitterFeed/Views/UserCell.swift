//
//  UserCell.swift
//  TwitterFeed
//
//  Created by Tye Porter on 1/17/19.
//  Copyright © 2019 Tye Porter. All rights reserved.
//

import LBTAComponents

class UserCell: DatasourceCell {
    
    override var datasourceItem: Any? {
        didSet {
            guard let user = datasourceItem as? User else {return}
            self.nameLabel.text = user.name
            self.usernameLabel.text = user.username
            self.bioTextView.text = user.bioText
            if user.name == "Tye Porter"{
                self.profileImageView.image = UIImage(named: "me_profile")
            } else {
                self.profileImageView.loadImage(urlString: user.profileImageName)
            }
        }
    }
    
    let profileImageView: CachedImageView = {
        let imageView = CachedImageView()
        imageView.image = UIImage(named: "me_profile")
        imageView.backgroundColor = UIColor.rgb(red: 230, green: 230, blue: 230)
        imageView.clipsToBounds = true
        imageView.layer.cornerRadius = 5
        return imageView
    }()
    
    let nameLabel: UILabel = {
        let label = UILabel()
        label.text = "Tye Porter"
        label.font = UIFont.boldSystemFont(ofSize: 16)
        return label
    }()
    
    let usernameLabel: UILabel = {
        let label = UILabel()
        label.text = "@tyeporter1"
        label.font = UIFont.systemFont(ofSize: 14)
        label.textColor = UIColor.rgb(red: 130, green: 130, blue: 130)
        return label
    }()
    
    let bioTextView: UITextView = {
        let textView = UITextView()
        textView.text = "Mobile Developer 📱. Swift and Dart. Welcome to my twitter. This is a bio. This is a bio. This is a bio."
        textView.font = UIFont.systemFont(ofSize: 15)
        textView.backgroundColor = UIColor.clear
        textView.isEditable = false
        return textView
    }()
    
    let followButton: UIButton = {
        let button = UIButton()
        let twitterBlueColor = UIColor.rgb(red: 61, green: 167, blue: 244)
        button.layer.cornerRadius = 5
        button.layer.borderColor = twitterBlueColor.cgColor
        button.layer.borderWidth = 1
        button.setTitle("Follow", for: UIControl.State.normal)
        button.setTitleColor(twitterBlueColor, for: UIControl.State.normal)
        button.setImage(UIImage(named: "follow"), for: UIControl.State.normal)
        button.imageView?.contentMode = UIView.ContentMode.scaleAspectFit
        button.imageEdgeInsets = UIEdgeInsets(top: 0, left: -8, bottom: 0, right: 0)
        button.titleLabel?.font = UIFont.boldSystemFont(ofSize: 14)
        
        return button
    }()
    
    override func setupViews() {
        super.setupViews()
        self.backgroundColor = UIColor.white
        self.separatorLineView.isHidden = false
        self.separatorLineView.backgroundColor = UIColor.rgb(red: 230, green: 230, blue: 230)
        
        self.addSubview(self.profileImageView)
        self.addSubview(self.nameLabel)
        self.addSubview(self.usernameLabel)
        self.addSubview(self.bioTextView)
        self.addSubview(self.followButton)
        
        self.profileImageView.anchor(width: 50, height: 50, top: self.topAnchor, bottom: nil, left: self.leftAnchor, right: nil, paddingTop: 12, paddingBottom: 0, paddingLeft: 12, paddingRight: 0, centerX: nil, centerY: nil, offsetX: 0, offsetY: 0)
        self.nameLabel.anchor(width: 0, height: 20, top: self.topAnchor, bottom: nil, left: self.profileImageView.rightAnchor, right: self.followButton.leftAnchor, paddingTop: 12, paddingBottom: 0, paddingLeft: 8, paddingRight: 12, centerX: nil, centerY: nil, offsetX: 0, offsetY: 0)
        self.usernameLabel.anchor(width: 0, height: 20, top: self.nameLabel.bottomAnchor, bottom: nil, left: self.nameLabel.leftAnchor, right: self.nameLabel.rightAnchor, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0, centerX: nil, centerY: nil, offsetX: 0, offsetY: 0)
        self.bioTextView.anchor(width: 0, height: 0, top: self.usernameLabel.bottomAnchor, bottom: self.bottomAnchor, left: self.usernameLabel.leftAnchor, right: self.rightAnchor, paddingTop: -4, paddingBottom: 0, paddingLeft: -4, paddingRight: 0, centerX: nil, centerY: nil, offsetX: 0, offsetY: 0)
        self.followButton.anchor(width: 120, height: 34, top: self.topAnchor, bottom: nil, left: nil, right: self.rightAnchor, paddingTop: 12, paddingBottom: 0, paddingLeft: 0, paddingRight: 12, centerX: nil, centerY: nil, offsetX: 0, offsetY: 0)
    }
    
}


//
// Created by Tye Porter on 2019-01-20.
// Copyright (c) 2019 Tye Porter. All rights reserved.
//

import UIKit
import FirebaseAuth
import FirebaseDatabase


class UserCell: UITableViewCell {
    
    var user: User? {
        didSet {
            if let user = self.user {
                self.textLabel?.text = user.name
                self.detailTextLabel?.text = user.email
                
                if let profileImageUrl = user.profileImageUrl {
                    self.profileImageView.loadImageUsingCacheWithUrlString(urlString: profileImageUrl)
                } else {
                    self.profileImageView.image = UIImage(named: "thumbnail")
                }
            }
        }
    }
    
    var message: Message? {
        didSet {
            if let message = self.message {
                self.setupProfileImageAndName()
                
                self.detailTextLabel?.text = message.text
                guard let timestampAsDouble = Double(message.timestamp) else {return}
                let timeInterval = TimeInterval(exactly: timestampAsDouble)
                
                let time = Date(timeIntervalSinceReferenceDate: timeInterval!)
                let dateFormatter = DateFormatter()
                dateFormatter.dateFormat = "h:mm a"
                self.timestampLabel.text = dateFormatter.string(from: time)
            }
        }
    }
    
    let profileImageView: UIImageView = {
        let imageView = UIImageView()
        imageView.backgroundColor = UIColor.rgb(red: 31, green: 32, blue: 33)
        imageView.layer.cornerRadius = 24
        imageView.layer.masksToBounds = true
        return imageView
    }()
    
    let timestampLabel: UILabel = {
        let label = UILabel()
        label.font = UIFont.systemFont(ofSize: 12)
        label.textColor = UIColor.gray
        return label
    }()

    override init(style: CellStyle, reuseIdentifier: String?) {
        super.init(style: UITableViewCell.CellStyle.subtitle, reuseIdentifier: reuseIdentifier)
        
        self.backgroundColor = UIColor.rgb(red: 50, green: 51, blue: 52)
        self.textLabel?.textColor = UIColor.white
        self.detailTextLabel?.textColor = UIColor.gray
        
        self.addSubview(self.profileImageView)
        self.profileImageView.anchor(width: 48, height: 48, top: nil, bottom: nil, left: self.leftAnchor, right: nil, paddingTop: 0, paddingBottom: 0, paddingLeft: 8, paddingRight: 0, centerX: nil, centerY: self.centerYAnchor, offsetX: 0, offsetY: 0)
        
        self.addSubview(self.timestampLabel)
        self.timestampLabel.anchor(width: 0, height: 0, top: self.topAnchor, bottom: nil, left: nil, right: self.rightAnchor, paddingTop: 15, paddingBottom: 0, paddingLeft: 0, paddingRight: 13, centerX: nil, centerY: nil, offsetX: 0, offsetY: 0)
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        
        self.textLabel?.frame = CGRect(x: 64, y: ((self.textLabel?.frame.origin.y)! - 2), width: (self.textLabel?.frame.width)!, height: (self.textLabel?.frame.height)!)
        
        self.detailTextLabel?.frame = CGRect(x: 64, y: ((self.detailTextLabel?.frame.origin.y)! + 2), width: (self.detailTextLabel?.frame.width)!, height: (self.detailTextLabel?.frame.height)!)
    }

    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }
    
    private func setupProfileImageAndName(){

        if let id = message?.chatPartnerId() {
            Database.database().reference().child("users").child(id).observeSingleEvent(of: DataEventType.value) { (snapshot) in
                if let dictionary = snapshot.value as? [String: Any] {
                    self.textLabel?.text = dictionary["username"] as? String
                    
                    if let profileImageUrl = dictionary["profileImageUrl"] as? String {
                        self.profileImageView.loadImageUsingCacheWithUrlString(urlString: profileImageUrl)
                    } else {
                        self.profileImageView.image = UIImage(named: "thumbnail")
                    }
                }
            }
        }
        
    }
}

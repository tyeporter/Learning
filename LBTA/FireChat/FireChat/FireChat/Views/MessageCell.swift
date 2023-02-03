//
//  MessageCell.swift
//  FireChat
//
//  Created by Tye Porter on 1/28/19.
//  Copyright © 2019 Tye Porter. All rights reserved.
//

import UIKit
import FirebaseDatabase
import FirebaseAuth

protocol MessageCellDelegate {
    func didTapPhoto(imageView: UIImageView)
}

class MessageCell: UICollectionViewCell {
    
    var delegate: MessageCellDelegate?
    
    var message: Message? {
        didSet {
            let toId = (self.message?.fromId)!
            Database.database().reference().child("users").child(toId).observeSingleEvent(of: DataEventType.value) { [unowned self] (snapshot) in
                guard let dictionary = snapshot.value as? [String: Any] else {return}
                self.nameLabel.text = dictionary["username"] as? String
                self.messageTextView.text = self.message?.text

                if let profileImageUrl = dictionary["profileImageUrl"] as? String {
                    self.profileImageView.loadImageUsingCacheWithUrlString(urlString: profileImageUrl)
                } else {
                    self.profileImageView.image = UIImage(named: "thumbnail")
                }
                
                if let messageImageUrl = self.message?.messageImageUrl {
                    self.messageImageView.loadImageUsingCacheWithUrlString(urlString: messageImageUrl)
                    self.messageImageView.isHidden = false
                    
                    self.messageImageView.isUserInteractionEnabled = true
                    self.messageImageView.addGestureRecognizer(UITapGestureRecognizer(target: self, action: #selector(self.handleImageTap)))
                    
                    if let messageImageHeight = self.message?.messageImageHeight, let messageImageWidth = self.message?.messageImageWidth {
                        self.messageImageView.heightAnchor.constraint(equalToConstant: CGFloat(messageImageHeight / messageImageWidth * 200)).isActive = true
                    }
                } else {
                    self.messageImageView.isHidden = true
                }
            }
        }
    }
    
    let profileImageView: UIImageView = {
        let imageView = UIImageView()
        imageView.backgroundColor = UIColor.rgb(red: 31, green: 32, blue: 33)
        imageView.layer.cornerRadius = 17
        imageView.layer.masksToBounds = true
        imageView.layer.borderColor = UIColor.black.cgColor
        imageView.layer.borderWidth = 0.5
        return imageView
    }()
    
    let nameLabel: UILabel = {
        let label = UILabel()
        label.font = UIFont.boldSystemFont(ofSize: 15)
        label.textColor = UIColor.gray
        return label
    }()
    
    let messageTextView: UITextView = {
        let textView = UITextView()
        textView.backgroundColor = UIColor.clear
        textView.textColor = UIColor.white
        textView.font = UIFont.systemFont(ofSize: 16)
        textView.isScrollEnabled = false
        textView.isEditable = false
        return textView
    }()
    
    let messageImageView: UIImageView = {
        let imageView = UIImageView()
        imageView.layer.cornerRadius = 14
        imageView.layer.masksToBounds = true
        imageView.contentMode = UIView.ContentMode.scaleAspectFill
        imageView.isHidden = true
        return imageView
    }()
    
    @objc func handleImageTap(tapGesture: UITapGestureRecognizer){
        print("tapped image")
        if let imageView = tapGesture.view as? UIImageView {
            self.delegate?.didTapPhoto(imageView: imageView)
        }
    }
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        self.backgroundColor = UIColor.clear

        self.addSubview(self.profileImageView)
        self.profileImageView.anchor(width: 34, height: 34, top: self.topAnchor, bottom: nil, left: self.leftAnchor, right: nil, paddingTop: 13, paddingBottom: 0, paddingLeft: 8, paddingRight: 0, centerX: nil, centerY: nil, offsetX: 0, offsetY: 0)
        
        self.addSubview(self.nameLabel)
        self.nameLabel.anchor(width: 0, height: 20, top: nil, bottom: nil, left: self.profileImageView.rightAnchor, right: self.rightAnchor, paddingTop: 13, paddingBottom: 0, paddingLeft: 8, paddingRight: 8, centerX: nil, centerY: self.profileImageView.centerYAnchor, offsetX: 0, offsetY: -14)
        
        self.addSubview(self.messageTextView)
        self.messageTextView.anchor(width: 0, height: 0, top: self.nameLabel.bottomAnchor, bottom: nil, left: self.nameLabel.leftAnchor, right: self.nameLabel.rightAnchor, paddingTop: 0, paddingBottom: 0, paddingLeft: -4, paddingRight: 0, centerX: nil, centerY: nil, offsetX: 0, offsetY: 0)
        
        self.addSubview(self.messageImageView)
        self.messageImageView.anchor(width: 0, height: 0, top: self.messageTextView.bottomAnchor, bottom: nil, left: self.messageTextView.leftAnchor, right: self.messageTextView.rightAnchor, paddingTop: 10, paddingBottom: 0, paddingLeft: 0, paddingRight: 0)
    }
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }
}

//
//  FeedCell.swift
//  FacebookFeed
//
//  Created by Tye Porter on 12/13/18.
//  Copyright © 2018 Tye Porter. All rights reserved.
//

import UIKit

class FeedCell : UICollectionViewCell {
    
    var post: Post? {
        didSet {
            if let name = self.post?.name {
                let attributedText = NSMutableAttributedString(string: name, attributes: [NSAttributedString.Key.font : UIFont.boldSystemFont(ofSize: 14)])
                attributedText.append(NSMutableAttributedString(string: "\nDecember 18 • San Francisco • ", attributes: [NSAttributedString.Key.font : UIFont.systemFont(ofSize: 12), NSAttributedString.Key.foregroundColor: UIColor.rgb(red: 155, green: 161, blue: 171)]))
                
                let paragraphStyle = NSMutableParagraphStyle()
                paragraphStyle.lineSpacing = 4
                attributedText.addAttributes([NSAttributedString.Key.paragraphStyle : paragraphStyle], range: NSRange(location: 0, length: attributedText.string.count))
                
                let attachment = NSTextAttachment()
                attachment.image = UIImage(named: "globe_small")
                attachment.bounds = CGRect(x: 0, y: -2, width: 12, height: 12)
                attributedText.append(NSAttributedString(attachment: attachment))
                
                self.nameLabel.attributedText = attributedText
            }
            
            if let statusText = self.post?.statusText {
                self.statusTextView.text = statusText
            }
            
            if let profileImageName = self.post?.profileImageName {
                self.profileImageView.image = UIImage(named: profileImageName)
            }
            
            if let statusImageName = self.post?.statusImageName {
                self.statusImageView.image = UIImage(named: statusImageName)
            }
            
            if let numberOfLikes = self.post?.numberOfLikes, let numberOfComments = self.post?.numberOfComments {
                self.likesCommentLabel.text = "\(numberOfLikes) Likes   \(numberOfComments) Comments"
                self.likesCommentLabel.font = UIFont.systemFont(ofSize: 12)
                self.likesCommentLabel.textColor = UIColor.rgb(red: 155, green: 161, blue: 171)
            }
        }
    }
    
    private let profileImageView: UIImageView = {
        let imageView = UIImageView()
        imageView.contentMode = UIView.ContentMode.scaleAspectFit
        imageView.backgroundColor = UIColor(white: 0.95, alpha: 1)
        imageView.translatesAutoresizingMaskIntoConstraints = false
        return imageView
    }()
    
    private let nameLabel: UILabel = {
        let label = UILabel()
        label.numberOfLines = 2
        label.translatesAutoresizingMaskIntoConstraints = false
        return label
    }()
    
    private let statusTextView: UITextView = {
        let textView = UITextView()
        textView.text = "..."
        textView.font = UIFont.systemFont(ofSize: 14)
        textView.isScrollEnabled = false
        textView.isEditable = false
        textView.translatesAutoresizingMaskIntoConstraints = false
        return textView
    }()
    
    private let statusImageView: UIImageView = {
        let imageView = UIImageView()
        imageView.backgroundColor = UIColor(white: 0.95, alpha: 1)
        imageView.contentMode = UIView.ContentMode.scaleAspectFill
        imageView.layer.masksToBounds = true
        imageView.translatesAutoresizingMaskIntoConstraints = false
        return imageView
    }()
    
    private let likesCommentLabel: UILabel = {
        let label = UILabel()
        label.translatesAutoresizingMaskIntoConstraints = false
        return label
    }()
    
    private let dividerLineView: UIView = {
        let view = UIView()
        view.backgroundColor = UIColor.rgb(red: 226, green: 228, blue: 232)
        view.translatesAutoresizingMaskIntoConstraints = false
        return view
    }()
    
    private let likeButton: UIButton = buttonForTitle(title: "Like", imageName: "like")
    private let commentButton: UIButton = buttonForTitle(title: "Comment", imageName: "comment")
    private let shareButton: UIButton = buttonForTitle(title: "Share", imageName: "share")
    
    static func buttonForTitle(title: String, imageName: String) -> UIButton {
        let button = UIButton(type: UIButton.ButtonType.system)
        button.setImage(UIImage(named: imageName), for: UIControl.State.normal)
        button.tintColor = UIColor.rgb(red: 143, green: 150, blue: 163)
        button.setTitle(title, for: UIControl.State.normal)
        button.titleLabel?.font = UIFont.boldSystemFont(ofSize: 14)
        button.setTitleColor(UIColor.rgb(red: 143, green: 150, blue: 163), for: UIControl.State.normal)
        
        button.titleEdgeInsets = UIEdgeInsets(top: 0, left: 8, bottom: 0, right: 0)
        
        button.translatesAutoresizingMaskIntoConstraints = false
        return button
    }
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupViews()
    }
    
    func setupViews(){
        self.backgroundColor = UIColor.white
        // Add subviews
        self.addSubview(self.profileImageView)
        self.addSubview(self.nameLabel)
        self.addSubview(self.statusTextView)
        self.addSubview(self.statusImageView)
        self.addSubview(self.likesCommentLabel)
        self.addSubview(self.dividerLineView)
        self.addSubview(self.likeButton)
        self.addSubview(self.commentButton)
        self.addSubview(self.shareButton)
        
        self.profileImageView.widthAnchor.constraint(equalToConstant: 44).isActive = true
        self.profileImageView.heightAnchor.constraint(equalToConstant: 44).isActive = true
        self.profileImageView.leftAnchor.constraint(equalTo: self.leftAnchor, constant: 8).isActive = true
        self.profileImageView.topAnchor.constraint(equalTo: self.topAnchor, constant: 8).isActive = true
        
        self.nameLabel.leftAnchor.constraint(equalTo: self.profileImageView.rightAnchor, constant: 8).isActive = true
        self.nameLabel.topAnchor.constraint(equalTo: self.topAnchor, constant: 12).isActive = true
        
//        self.statusTextView.heightAnchor.constraint(equalToConstant: 30).isActive = true
        self.statusTextView.leftAnchor.constraint(equalTo: self.leftAnchor, constant: 8).isActive = true
        self.statusTextView.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -8).isActive = true
        self.statusTextView.topAnchor.constraint(equalTo: self.profileImageView.bottomAnchor, constant: 4).isActive = true
        self.statusTextView.bottomAnchor.constraint(equalTo: self.statusImageView.topAnchor, constant: -4).isActive = true
        
        self.statusImageView.leftAnchor.constraint(equalTo: self.leftAnchor).isActive = true
        self.statusImageView.rightAnchor.constraint(equalTo: self.rightAnchor).isActive = true
//        self.statusImageView.topAnchor.constraint(equalTo: self.statusTextView.bottomAnchor, constant: 4).isActive = true
        self.statusImageView.heightAnchor.constraint(equalToConstant: 200).isActive = true
        self.statusImageView.bottomAnchor.constraint(equalTo: self.likesCommentLabel.topAnchor, constant: -8).isActive = true

        
        self.likesCommentLabel.heightAnchor.constraint(equalToConstant: 24).isActive = true
        self.likesCommentLabel.leftAnchor.constraint(equalTo: self.leftAnchor, constant: 12).isActive = true
        self.likesCommentLabel.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -8).isActive = true
//        self.likesCommentLabel.topAnchor.constraint(equalTo: self.statusImageView.bottomAnchor, constant: 8).isActive = true
        self.likesCommentLabel.bottomAnchor.constraint(equalTo: self.dividerLineView.topAnchor, constant: -8).isActive = true

        
        self.dividerLineView.heightAnchor.constraint(equalToConstant: 0.5).isActive = true
        self.dividerLineView.leftAnchor.constraint(equalTo: self.leftAnchor, constant: 12).isActive = true
//        self.dividerLineView.topAnchor.constraint(equalTo: self.likesCommentLabel.bottomAnchor, constant: 8).isActive = true
        self.dividerLineView.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -12).isActive = true
        self.dividerLineView.bottomAnchor.constraint(equalTo: self.likeButton.topAnchor).isActive = true

        
        self.likeButton.heightAnchor.constraint(equalToConstant: 44).isActive = true
        self.likeButton.widthAnchor.constraint(equalToConstant: 120).isActive = true
        self.likeButton.leftAnchor.constraint(equalTo: self.leftAnchor).isActive = true
//        self.likeButton.topAnchor.constraint(equalTo: self.dividerLineView.bottomAnchor).isActive = true
        self.likeButton.bottomAnchor.constraint(equalTo: self.bottomAnchor).isActive = true

        
        self.commentButton.heightAnchor.constraint(equalToConstant: 44).isActive = true
        self.commentButton.leftAnchor.constraint(equalTo: self.likeButton.rightAnchor).isActive = true
//        self.commentButton.topAnchor.constraint(equalTo: self.dividerLineView.bottomAnchor).isActive = true
        self.commentButton.rightAnchor.constraint(equalTo: self.shareButton.leftAnchor).isActive = true
        self.commentButton.bottomAnchor.constraint(equalTo: self.bottomAnchor).isActive = true

        
        self.shareButton.heightAnchor.constraint(equalToConstant: 44).isActive = true
        self.shareButton.widthAnchor.constraint(equalToConstant: 120).isActive = true
        self.shareButton.rightAnchor.constraint(equalTo: self.rightAnchor).isActive = true
        self.shareButton.bottomAnchor.constraint(equalTo: self.bottomAnchor).isActive = true
//        self.shareButton.topAnchor.constraint(equalTo: self.dividerLineView.bottomAnchor).isActive = true
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

extension UIColor {
    static func rgb(red: CGFloat, green: CGFloat, blue: CGFloat) -> UIColor {
        return UIColor(red: red/255, green: green/255, blue: blue/255, alpha: 1)
    }
}

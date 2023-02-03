//
//  TweetCell.swift
//  TwitterFeed
//
//  Created by Tye Porter on 1/19/19.
//  Copyright © 2019 Tye Porter. All rights reserved.
//

import LBTAComponents

class TweetCell: DatasourceCell {
    
    override var datasourceItem: Any? {
        didSet {
            guard let tweet = datasourceItem as? Tweet else {return}
            
            if tweet.user.name == "Steve Jobs" {
                self.profileImageView.image = UIImage(named: "steve_profile")
            } else {
                self.profileImageView.loadImage(urlString: tweet.user.profileImageName)
            }
            
            let attrString = NSMutableAttributedString(
                string: "\(tweet.user.name) ", attributes: [
                    NSAttributedString.Key.font : UIFont.boldSystemFont(ofSize: 16)
                ])
            attrString.append(NSAttributedString(
                string: "\(tweet.user.username)\n", attributes: [
                    NSAttributedString.Key.font: UIFont.systemFont(ofSize: 15),
                    NSAttributedString.Key.foregroundColor: UIColor.gray
                ]))
            
            let paragraphStyle = NSMutableParagraphStyle()
            paragraphStyle.lineSpacing = 4
            let range = NSMakeRange(0, attrString.string.count)
            attrString.addAttribute(NSAttributedString.Key.paragraphStyle, value: paragraphStyle, range: range)
            
            attrString.append(NSAttributedString(
                string: tweet.tweet, attributes: [
                    NSAttributedString.Key.font : UIFont.systemFont(ofSize: 15)
                ]))
            
            
            self.tweetTextView.attributedText = attrString
        }
    }
    
    let profileImageView: CachedImageView = {
        let imageView = CachedImageView()
        imageView.backgroundColor = UIColor.rgb(red: 230, green: 230, blue: 230)
        imageView.clipsToBounds = true
        imageView.layer.cornerRadius = 5
        return imageView
    }()
    
    let tweetTextView: UITextView = {
        let textView = UITextView()
        textView.backgroundColor = UIColor.clear
        textView.isEditable = false
        return textView
    }()
    
    let replyButton: UIButton = {
        let button = UIButton(type: UIButton.ButtonType.system)
        button.setImage(UIImage(named: "reply")?.withRenderingMode(UIImage.RenderingMode.alwaysOriginal), for: UIControl.State.normal)
        button.imageView?.contentMode = UIView.ContentMode.scaleAspectFit
        button.contentHorizontalAlignment = UIControl.ContentHorizontalAlignment.left

        return button
    }()
    
    let retweetButton: UIButton = {
        let button = UIButton(type: UIButton.ButtonType.system)
        button.setImage(UIImage(named: "retweet")?.withRenderingMode(UIImage.RenderingMode.alwaysOriginal), for: UIControl.State.normal)
        button.imageView?.contentMode = UIView.ContentMode.scaleAspectFit
        button.contentHorizontalAlignment = UIControl.ContentHorizontalAlignment.left

        return button
    }()
    
    let likeButton: UIButton = {
        let button = UIButton(type: UIButton.ButtonType.system)
        button.setImage(UIImage(named: "like")?.withRenderingMode(UIImage.RenderingMode.alwaysOriginal), for: UIControl.State.normal)
        button.imageView?.contentMode = UIView.ContentMode.scaleAspectFit
        button.contentHorizontalAlignment = UIControl.ContentHorizontalAlignment.left
        
        return button
    }()
    
    let messageButton: UIButton = {
        let button = UIButton(type: UIButton.ButtonType.system)
        button.setImage(UIImage(named: "send_message")?.withRenderingMode(UIImage.RenderingMode.alwaysOriginal), for: UIControl.State.normal)
        button.imageView?.contentMode = UIView.ContentMode.scaleAspectFit
        button.contentHorizontalAlignment = UIControl.ContentHorizontalAlignment.left
        
        return button
    }()
    
    override func setupViews() {
        super.setupViews()
        self.backgroundColor = UIColor.white
        self.separatorLineView.isHidden = false
        self.separatorLineView.backgroundColor = UIColor.rgb(red: 230, green: 230, blue: 230)
        
        self.addSubview(self.profileImageView)
        self.addSubview(self.tweetTextView)
        self.profileImageView.anchor(width: 50, height: 50, top: self.topAnchor, bottom: nil, left: self.leftAnchor, right: nil, paddingTop: 12, paddingBottom: 0, paddingLeft: 12, paddingRight: 0, centerX: nil, centerY: nil, offsetX: 0, offsetY: 0)
        self.tweetTextView.anchor(width: 0, height: 0, top: self.topAnchor, bottom: self.bottomAnchor, left: self.profileImageView.rightAnchor, right: self.rightAnchor, paddingTop: 4, paddingBottom: 0, paddingLeft: 4, paddingRight: 0, centerX: nil, centerY: nil, offsetX: 0, offsetY: 0)
        self.setupTweetActionButtons()
    }
    
    fileprivate func setupTweetActionButtons(){
        let stackView = UIStackView(arrangedSubviews: [self.replyButton, self.retweetButton, self.likeButton, self.messageButton])
        stackView.distribution = UIStackView.Distribution.fillEqually
        stackView.axis = NSLayoutConstraint.Axis.horizontal
        stackView.backgroundColor = UIColor.red
        
        self.addSubview(stackView)
        stackView.anchor(width: 0, height: 20, top: nil, bottom: self.bottomAnchor, left: self.tweetTextView.leftAnchor, right: self.rightAnchor, paddingTop: 0, paddingBottom: 8, paddingLeft: 0, paddingRight: 0, centerX: nil, centerY: nil, offsetX: 0, offsetY: 0)
    }
}

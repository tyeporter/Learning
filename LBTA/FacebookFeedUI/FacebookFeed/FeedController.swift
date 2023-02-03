//
//  ViewController.swift
//  FacebookFeed
//
//  Created by Tye Porter on 12/13/18.
//  Copyright © 2018 Tye Porter. All rights reserved.
//

import UIKit

class FeedController: UICollectionViewController, UICollectionViewDelegateFlowLayout {
    
    var posts = [Post]()

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        self.navigationItem.title = "Facebook Feed"
        self.collectionView.backgroundColor = UIColor(white: 0.95, alpha: 1)
        self.collectionView.alwaysBounceVertical = true
        
        self.collectionView.register(FeedCell.self, forCellWithReuseIdentifier: "cellId")
        
        let postMark = Post()
        postMark.name = "Mark Zuckerberg"
        postMark.statusText = "Meanwhile, Beast turned to the dark side."
        postMark.profileImageName = "zuckprofile"
        postMark.statusImageName = "zuckdog"
        postMark.numberOfLikes = 400
        postMark.numberOfComments = 123
        
        let postSteve = Post()
        postSteve.name = "Steve Jobs"
        postSteve.statusText = "Design is not just what it looks like and feels like. Design is how it works\n\nBeing the richest man in the cemetary doesn't matter to me. Going to bed at night saying we didi something wonderful, that's what matters to me.\n\nSometimes when you innovate, you make mistakes. It is best to admit them quickly, and get on with improving your other innovations."
        postSteve.profileImageName = "steve_profile"
        postSteve.statusImageName = "steve_status"
        postSteve.numberOfLikes = 1000
        postSteve.numberOfComments = 55
        
        let postGandhi = Post()
        postGandhi.name = "Mahatma Gandhi"
        postGandhi.statusText = "Live as if you were to die tomorrow; learn as if you were to live forever."
        postGandhi.profileImageName = "gandhi"
        postGandhi.statusImageName = "gandhi_status"
        postGandhi.numberOfLikes = 333
        postGandhi.numberOfComments = 22
        
        self.posts.append(postMark)
        self.posts.append(postSteve)
        self.posts.append(postGandhi)
    }
    
    override func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return self.posts.count
    }
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
        
        if let statusText = posts[indexPath.item].statusText {
            let rect = NSString(string: statusText).boundingRect(with: CGSize(width: self.view.frame.width, height: 1000), options: NSStringDrawingOptions.usesFontLeading.union(NSStringDrawingOptions.usesLineFragmentOrigin), attributes: [NSAttributedString.Key.font : UIFont.systemFont(ofSize: 14)], context: nil)
            
            return CGSize(width: self.view.frame.width, height: 355 + rect.height + 14)
        }
        
        return CGSize(width: self.view.frame.width, height: 500)
    }
    
    override func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let feedCell = self.collectionView.dequeueReusableCell(withReuseIdentifier: "cellId", for: indexPath) as! FeedCell
        let post = self.posts[indexPath.item]
        feedCell.post = post
        return feedCell
        
    }
}


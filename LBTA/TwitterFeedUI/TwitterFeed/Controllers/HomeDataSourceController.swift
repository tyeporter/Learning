//
//  HomeDataSourceController.swift
//  TwitterFeed
//
//  Created by Tye Porter on 1/17/19.
//  Copyright © 2019 Tye Porter. All rights reserved.
//


import LBTAComponents

class HomeDataSourceController: DatasourceController {
    
    // MARK: - Properties
    
    let homeDatasource = HomeDataSource()
    
    /** Properties - Views **/
    
    let errorMessage: UILabel = {
        let label = UILabel()
        label.text = "We apologize. Something went wrong. Please try again later..."
        label.textAlignment = NSTextAlignment.center
        label.numberOfLines = 0
        label.isHidden = true
        return label
    }()

    // MARK: - Lifecycle
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Setup view controller
        self.setupNavigationBar()
        self.collectionView.backgroundColor = UIColor.rgb(red: 232, green: 236, blue: 241)
        self.view.addSubview(self.errorMessage)
        self.errorMessage.fillSuperview()
        
        // Add data source
        self.datasource = homeDatasource
        
        // Fetch home feed
        self.fetchHomeFeed()
    }
    
    // Redraws layout when orientation changes
    override func willTransition(to newCollection: UITraitCollection, with coordinator: UIViewControllerTransitionCoordinator) {
        self.collectionViewLayout.invalidateLayout()
    }

    // MARK: - Collection View

    /** Collection View - Header/Footer **/
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, referenceSizeForHeaderInSection section: Int) -> CGSize {
        if section == 1 {
            return CGSize.zero
        }
        
        if collectionView.numberOfItems(inSection: 0) < 1 {
            return CGSize.zero
        }
        
        return CGSize(width: self.view.frame.width, height: 50)
    }
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, referenceSizeForFooterInSection section: Int) -> CGSize {
        if section == 1 {
            return CGSize.zero
        }
        
        if collectionView.numberOfItems(inSection: 0) < 1 {
            return CGSize.zero
        }
        
        return CGSize(width: self.view.frame.width, height: 50)
    }
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, insetForSectionAt section: Int) -> UIEdgeInsets {
        if section == 1 {
            return UIEdgeInsets(top: 14, left: 0, bottom: 14, right: 0)
        }
        return UIEdgeInsets.zero
    }

    /** Collection View - Cells **/

    override func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
        if indexPath.section == 0 {
            guard let user = self.datasource?.item(indexPath) as? User else {return CGSize.zero}
            let approximateWidth = self.view.frame.width - 12 - 50 - 8 - 2
            let size = CGSize(width: approximateWidth, height: 1000)
            let estimatedFrame = NSString(string: user.bioText).boundingRect(
                with: size,
                options: NSStringDrawingOptions.usesLineFragmentOrigin,
                attributes: [
                    NSAttributedString.Key.font : UIFont.systemFont(ofSize: 15)
                ],
                context: nil)
            return CGSize(width: self.view.frame.width, height: estimatedFrame.height + 66)
        
        } else if indexPath.section == 1 {
            guard let tweet = self.datasource?.item(indexPath) as? Tweet else {return CGSize.zero}
            let approximateWidth = self.view.frame.width - 12 - 50 - 8 - 2
            let size = CGSize(width: approximateWidth, height: 1000)
            let estimatedFrame = NSString(string: tweet.tweet).boundingRect(
                with: size,
                options: NSStringDrawingOptions.usesLineFragmentOrigin,
                attributes: [
                    NSAttributedString.Key.font : UIFont.systemFont(ofSize: 15)
                ],
                context: nil)
            return CGSize(width: self.view.frame.width, height: estimatedFrame.height + 75)
            
        }
        return CGSize(width: self.view.frame.width, height: 150)
    }
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, minimumLineSpacingForSectionAt section: Int) -> CGFloat {
        return 0
    }

    // MARK: - Helper

    fileprivate func setupNavigationBar(){
        let imageView = UIImageView(image: UIImage(named: "title_icon"))
        imageView.frame = CGRect(x: 0, y: 0, width: 30, height: 30)
        imageView.contentMode = UIView.ContentMode.scaleAspectFit
        self.navigationItem.titleView = imageView

        let followButton = UIButton(type: UIButton.ButtonType.system)
        followButton.setImage(UIImage(named: "follow")?.withRenderingMode(UIImage.RenderingMode.alwaysOriginal), for: UIControl.State.normal)
        followButton.imageView?.contentMode = UIView.ContentMode.scaleAspectFit
        followButton.frame = CGRect(x: 0, y: 0, width: 30, height: 30)
        self.navigationItem.leftBarButtonItem = UIBarButtonItem(customView: followButton)
        
        let composeButton = UIButton(type: UIButton.ButtonType.system)
        composeButton.setImage(UIImage(named: "compose")?.withRenderingMode(UIImage.RenderingMode.alwaysOriginal), for: UIControl.State.normal)
        composeButton.imageView?.contentMode = UIView.ContentMode.scaleAspectFit
        composeButton.frame = CGRect(x: 0, y: 0, width: 30, height: 30)
        
        let searchButton = UIButton(type: UIButton.ButtonType.system)
        searchButton.setImage(UIImage(named: "search")?.withRenderingMode(UIImage.RenderingMode.alwaysOriginal), for: UIControl.State.normal)
        searchButton.imageView?.contentMode = UIView.ContentMode.scaleAspectFit
        searchButton.frame = CGRect(x: 0, y: 0, width: 30, height: 30)
        
        self.navigationItem.rightBarButtonItems = [
            UIBarButtonItem(customView: composeButton),
            UIBarButtonItem(customView: searchButton)
        ]
        
        self.navigationController?.navigationBar.isTranslucent = false
        self.navigationController?.navigationBar.backgroundColor = UIColor.white
        self.navigationController?.navigationBar.shadowImage = UIImage()
        
        let navigationSeparator = UIView()
        navigationSeparator.backgroundColor = UIColor.rgb(red: 230, green: 230, blue: 230)
        self.view.addSubview(navigationSeparator)
        navigationSeparator.anchor(width: 0, height: 1, top: self.view.topAnchor, bottom: nil, left: self.view.leftAnchor, right: self.view.rightAnchor, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0, centerX: nil, centerY: nil, offsetX: 0, offsetY: 0)
    }
    
    /** Helper - Networking **/
    
    var users: [User]?
    
    fileprivate func fetchHomeFeed(){
        if let url = URL(string: "https://api.letsbuildthatapp.com/twitter/home"){
            URLSession.shared.dataTask(with: url) { (data, response, error) in
                if let err = error {
                    print("Failed to fetch json for home", err)
                    DispatchQueue.main.async {
                        self.errorMessage.isHidden = false
                    }
                    return
                }
                
                guard let data = data else {return}
            
                do {
                    let json = try JSONSerialization.jsonObject(with: data, options: JSONSerialization.ReadingOptions.mutableContainers)
                    guard let jsonDictionaries = json as? [String: Array<Any>] else {return}
                    guard let usersDictionaries = jsonDictionaries["users"] as? [[String: Any]] else {return}
                    guard let tweetDictionaries = jsonDictionaries["tweets"] as? [[String: Any]] else {return}
                    
                    for user in usersDictionaries {
                        let userObj = User(withDictionary: user)
                        print(userObj)
                        self.homeDatasource.users.append(userObj)
                    }
                    
                    for tweet in tweetDictionaries {
                        let tweetObj = Tweet(withDictionary: tweet)
                        print(tweetObj)
                        self.homeDatasource.tweets.append(tweetObj)
                    }
                    
                    DispatchQueue.main.async {
                        self.collectionView.reloadData()
                    }
                    
                } catch let err {
                    // Status code 404
                    print("Failed to serialize json", err)
                    DispatchQueue.main.async {
                        self.errorMessage.isHidden = false
                        self.errorMessage.text = "Status code 404"
                    }
                }
            }.resume()
        }
    }

    /** Helper - Actions **/
    
    @objc func handleFollow(){
        print("Following...")
    }
    
    @objc func handleSearch(){
        print("Searching...")
    }
    
    @objc func handleCompose(){
        print("Composing...")
    }

}



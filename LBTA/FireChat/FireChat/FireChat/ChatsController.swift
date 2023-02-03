//
//  ViewController.swift
//  FireChat
//
//  Created by Tye Porter on 1/9/19.
//  Copyright © 2019 Tye Porter. All rights reserved.
//

// TODO: - CODE CLEANUP, MESSAGE DELETION, NOTIFICATIONS

import UIKit
import FirebaseAuth
import FirebaseDatabase

class ChatsController: UITableViewController {
    
    // MARK: - Properties
    
    var messages = [Message]()
    var lastMessageHelperDictionary = [String: Message]()
    
    // MARK: - Lifecycle Methods

    override func viewDidLoad() {
        super.viewDidLoad()
        self.tableView.backgroundColor = UIColor.rgb(red: 57, green: 58, blue: 59)
        self.tableView.separatorColor = UIColor.darkGray
        // Do any additional setup after loading the view, typically from a nib
        if Auth.auth().currentUser != nil {
            self.controllerSetup()
        } else {
            perform(#selector(handleLogout), with: nil, afterDelay: 0)
        }
    }
    
    func controllerSetup(){
        self.tableView.separatorInset.left = 58
        self.tableView.register(UserCell.self, forCellReuseIdentifier: "cellId")
        self.tableView.tableFooterView = UIView()
        
        self.setupChatsView()
    }
    
    // MARK: - Delegation
    
    /** Delegation - Table View **/

    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = self.tableView.dequeueReusableCell(withIdentifier: "cellId", for: indexPath) as! UserCell
        let bgView = UIView()
        bgView.backgroundColor = UIColor.rgb(red: 41, green: 42, blue: 43)
        cell.selectedBackgroundView = bgView
        cell.message = messages[indexPath.row]
        
        return cell
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if self.messages.count != 0 {
            return self.messages.count
        }
        return 0
    }
    
    override func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 72
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let message = self.messages[indexPath.row]
        guard let chatPartnerId = message.chatPartnerId() else {return}
        Database.database().reference().child("users").child(chatPartnerId).observeSingleEvent(of: DataEventType.value) { (snapshot) in
            guard let dictionary = snapshot.value as? [String: Any] else {return}
            let id = snapshot.key
            
            guard let email = dictionary["email"] as? String else {return}
            guard let name = dictionary["username"] as? String else {return}
            
            var user = User(id: id, name: name, email: email)
            if let profileImageUrl = dictionary["profileImageUrl"] as? String {
                user.profileImageUrl = profileImageUrl
            }
            
            self.showChatController(forUser: user)
        }
    }
    
    // MARK: - Helper
    
    /** Helper - UI **/
    
    func setupChatsView(){
        guard let uid = Auth.auth().currentUser?.uid else {return}
        Database.database().reference().child("users").child(uid).observeSingleEvent(of: DataEventType.value, with: { (snapshot) in
            guard let userDictionary = snapshot.value as? [String: Any] else {return}

            self.setupNavigationBarStyles()
        })
    }

    func setupNavigationBarStyles() {
        self.title = "Chats"
        self.navigationController?.navigationBar.layer.masksToBounds = false
        self.navigationController?.navigationBar.layer.shadowColor = UIColor.rgb(red: 40, green: 41, blue: 42).cgColor
        self.navigationController?.navigationBar.layer.shadowOpacity = 0.7
        self.navigationController?.navigationBar.layer.shadowOffset = CGSize(width: 0, height: 2.0)
        
        self.navigationController?.navigationBar.prefersLargeTitles = true
        self.navigationItem.largeTitleDisplayMode = UINavigationItem.LargeTitleDisplayMode.always

        self.navigationController?.navigationBar.largeTitleTextAttributes = [NSAttributedString.Key.foregroundColor: UIColor.white]
        self.navigationController?.navigationBar.titleTextAttributes = [NSAttributedString.Key.foregroundColor: UIColor.white]
        
        self.navigationItem.rightBarButtonItem = UIBarButtonItem(image: UIImage(named: "compose"), style: UIBarButtonItem.Style.plain, target: self, action: #selector(handleNewMessage))
        self.navigationItem.leftBarButtonItem = UIBarButtonItem(image: UIImage(named: "menu"), style: UIBarButtonItem.Style.plain, target: self, action: #selector(handleLogout))
        self.navigationItem.rightBarButtonItem?.tintColor = UIColor.white
        self.navigationItem.leftBarButtonItem?.tintColor = UIColor.white
        
        self.observeUserMessages()
    }
    
    func showChatController(forUser user: User){
        let chatLogController = ChatLogController(collectionViewLayout: UICollectionViewFlowLayout())
        chatLogController.user = user
        self.navigationController?.pushViewController(chatLogController, animated: true)
    }
    
    var timer: Timer?
    
    private func attemptReloadOfTable(){
        self.timer?.invalidate()
        self.timer = Timer.scheduledTimer(timeInterval: 0.1, target: self, selector: #selector(self.handleTableReload), userInfo: nil, repeats: false)
    }
    
    /** Helper - Networking **/
    
    func observeUserMessages() {
        
        guard let uid = Auth.auth().currentUser?.uid else {return}
        
        Database.database().reference().child("messages/user-messages").child(uid).observe(DataEventType.childAdded, with: { (snapshot) in
            
            let userId = snapshot.key
            Database.database().reference().child("messages/user-messages").child(uid).child(userId).observe(DataEventType.childAdded, with: { (snapshot) in
                
                let messageId = snapshot.key
                self.fetchMessageWithMessageId(messageId)
            })
        })
    }
    
    private func fetchMessageWithMessageId(_ messageId: String){
       Database.database().reference().child("messages").child(messageId).observeSingleEvent(of: DataEventType.value, with: { (snapshot) in
            
            guard let dictionary = snapshot.value as? [String: Any] else {return}
            guard let toId = dictionary["toId"] as? String else {return}
            guard let fromId = dictionary["fromId"] as? String else {return}
            guard let message = dictionary["message"] as? String else {return}
            guard let timestamp = dictionary["timestamp"] as? String else {return}
            
            let newMessage = Message(
                fromId: fromId,
                toId: toId,
                text: message,
                timestamp: timestamp)
            
            if let chatPartnerId = newMessage.chatPartnerId() {
                self.lastMessageHelperDictionary[chatPartnerId] = newMessage
            }
            self.attemptReloadOfTable()
        })
    }
    
    /** Helper - Actions **/
    
    @objc func handleTableReload(){
        self.messages = Array(self.lastMessageHelperDictionary.values)
        
        // Sort the array by timestamp
        self.messages.sort(by: { (firstMessage, secondMessage) -> Bool in
            return Double(firstMessage.timestamp)! > Double(secondMessage.timestamp)!
        })
        
        DispatchQueue.main.async {
            self.tableView.reloadData()
        }
    }
    
    @objc func handleNewMessage(){
        let newMessageController = NewMessageController()
        newMessageController.chatControllerRef = self
        let newMessageNavController = LightStatusBarNavController(rootViewController: newMessageController)
        present(newMessageNavController, animated: true, completion: nil)
    }
    
    @objc func handleLogout(){
        // Remove observers
        if Auth.auth().currentUser != nil {
            guard let uid = Auth.auth().currentUser?.uid else {return}
            Database.database().reference().child("messages/user-messages").child(uid).removeAllObservers()
        }
        
        // Remove navigation items
        self.navigationItem.leftBarButtonItem = nil
        self.navigationItem.rightBarButtonItem = nil
        self.title = ""
        
        // Remove table view data
        self.messages.removeAll()
        self.lastMessageHelperDictionary.removeAll()
        self.tableView.reloadData()
        
        // Sign out via Firebase Auth
        do {
            try Auth.auth().signOut()
        } catch let err {
            print("Unable to sign out: ", err)
        }
        
        // Present an instance of LoginController
        let loginController = LoginController()
        loginController.chatsControllerRef = self
        let navController = UINavigationController(rootViewController: loginController)
        present(navController, animated: true, completion: nil)
    }
}


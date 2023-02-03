//
//  NewMessageController.swift
//  FireChat
//
//  Created by Tye Porter on 1/11/19.
//  Copyright © 2019 Tye Porter. All rights reserved.
//

import UIKit
import FirebaseDatabase

class NewMessageController: UITableViewController {
    
    var users = [User]()
    weak var chatControllerRef: ChatsController?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.setupNavigationBarStyles()
        
        self.tableView.backgroundColor = UIColor.rgb(red: 57, green: 58, blue: 59)
        self.tableView.separatorColor = UIColor.darkGray
        self.tableView.register(UserCell.self, forCellReuseIdentifier: "cellId")
        self.tableView.tableFooterView = UIView()
        self.fetchUsers()
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewDidAppear(animated)
        Database.database().reference().child("users").removeAllObservers()
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = self.tableView.dequeueReusableCell(withIdentifier: "cellId", for: indexPath) as! UserCell
        let bgView = UIView()
        bgView.backgroundColor = UIColor.rgb(red: 41, green: 42, blue: 43)
        cell.selectedBackgroundView = bgView
        cell.user = users[indexPath.row]
        
        return cell
    }
    
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return self.users.count
    }
    
    override func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 72
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        dismiss(animated: true) {
            let selectedUser = self.users[indexPath.row]
            self.chatControllerRef?.showChatController(forUser: selectedUser)
        }
    }
    
    // MARK: - Helper
    
    func setupNavigationBarStyles() {
        self.title = "New Message"
        self.navigationController?.navigationBar.layer.masksToBounds = false
        self.navigationController?.navigationBar.layer.shadowColor = UIColor.rgb(red: 40, green: 41, blue: 42).cgColor
        self.navigationController?.navigationBar.layer.shadowOpacity = 0.7
        self.navigationController?.navigationBar.layer.shadowOffset = CGSize(width: 0, height: 2.0)
        
        self.navigationController?.navigationBar.isTranslucent = false
        self.navigationController?.navigationBar.barTintColor = UIColor.rgb(red: 50, green: 51, blue: 52)
        
        self.navigationController?.navigationBar.titleTextAttributes = [NSAttributedString.Key.foregroundColor: UIColor.white]
        
        self.navigationItem.rightBarButtonItem = UIBarButtonItem(barButtonSystemItem: UIBarButtonItem.SystemItem.cancel, target: self, action: #selector(handleCancel))
    }
    
    func fetchUsers(){
        Database.database().reference().child("users").observe(DataEventType.childAdded) { (snapshot) in
            if let dictionary = snapshot.value as? [String: Any] {
                print(dictionary)
                let id = snapshot.key
                guard let email = dictionary["email"] as? String else {return}
                guard let name = dictionary["username"] as? String else {return}
                
                var user = User(id: id, name: name, email: email)
                if let profileImageUrl = dictionary["profileImageUrl"] as? String {
                    user.profileImageUrl = profileImageUrl
                }
                self.users.append(user)

                DispatchQueue.main.async {
                    self.tableView.reloadData()
                }
            }
        }
    }
    
    @objc func handleCancel(){
        self.dismiss(animated: true, completion: nil)
    }
}

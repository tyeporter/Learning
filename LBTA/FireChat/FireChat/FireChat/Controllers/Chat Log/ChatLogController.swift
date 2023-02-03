//
//  ChatLogController.swift
//  FireChat
//
//  Created by Tye Porter on 1/21/19.
//  Copyright © 2019 Tye Porter. All rights reserved.
//

// TODO: - CODE CLEANUP, MESSAGE DELETION, NOTIFICATIONS

import UIKit
import FirebaseAuth
import FirebaseDatabase
import FirebaseStorage

class ChatLogController: UICollectionViewController, UICollectionViewDelegateFlowLayout, ComposerDelegate, MessageCellDelegate, UIImagePickerControllerDelegate, UINavigationControllerDelegate {
    
    var user: User?
    var messages = [Message]()
    let composer = Composer()

    var selectedPhoto: UIImage?
    var photoIsSelected: Bool? {
        didSet {
            if photoIsSelected == true {
                guard let image = selectedPhoto else {return}
                self.composer.selectedViewImageView.image = image
                self.composer.selectedImageViewContainer.isHidden = false
            } else {
                self.selectedPhoto = nil
                self.composer.selectedViewImageView.image = nil
            }
        }
    }
    
    override var inputAccessoryView: UIView? {
        composer.frame = CGRect(x: 0, y: 0, width: self.view.frame.width, height: 90)
        composer.backgroundColor = UIColor.clear
        composer.delegate = self
        return composer
    }
    
    override var canBecomeFirstResponder: Bool {
        return true
    }
    
    // MARK: - Lifecycle
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // CollectionView setup
        self.collectionView.backgroundColor = UIColor.rgb(red: 57, green: 58, blue: 59)
        self.collectionView.register(MessageCell.self, forCellWithReuseIdentifier: "cellId")
        self.collectionView.alwaysBounceVertical = true
        self.collectionView.showsVerticalScrollIndicator = false
        self.collectionView.keyboardDismissMode = UIScrollView.KeyboardDismissMode.interactive
        
        // Navigation bar setup
        self.setupNavigationBarStyles()
        self.observeMessages()
        
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(handleKeyboardDidShow),
            name: UIResponder.keyboardDidShowNotification,
            object: nil)
    }
    
    @objc func handleKeyboardDidShow(){
        if messages.count > 0 {
            let indexPath = IndexPath(item: self.messages.count - 1, section: 0)
            self.collectionView.scrollToItem(at: indexPath, at: UICollectionView.ScrollPosition.top, animated: true)
        }
    }
    
//    override func viewWillDisappear(_ animated: Bool) {
//        super.viewWillDisappear(animated)
//
//        if let uid = Auth.auth().currentUser?.uid {
//            self.dbRef?.child("messages/user-messages").child(uid).removeAllObservers()
//        }
//
//        if self.composer.composerTextField.isFirstResponder {
//            self.composer.composerTextField.resignFirstResponder()
//        }
//    }
    
    deinit {
        guard let uid = Auth.auth().currentUser?.uid, let userId = self.user?.id else {return}
        Database.database().reference().child("messages/user-messages").child(uid).child(userId).removeAllObservers()
        NotificationCenter.default.removeObserver(self)
        print("WORKING")
        print("De-initializing an instance of ChatLogController")
    }
    
    override func removeFromParent() {
        super.removeFromParent()
        print("WORKING")
    }
    
    // MARK: - Delegation
    
    /** Delegation - Collection View **/
    
    override func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = self.collectionView.dequeueReusableCell(withReuseIdentifier: "cellId", for: indexPath) as! MessageCell
        cell.delegate = self
        if self.messages.count != 0 {
            cell.message = messages[indexPath.item]
            print(messages[indexPath.item].fromId)
        }
        return cell
    }

    override func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        if self.messages.count != 0 {
            return self.messages.count
        }
        return 0
    }
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
        if messages.count != 0 {
            let messageText = messages[indexPath.item].text
            let rect = NSString(string: messageText).boundingRect(
                with: CGSize(width: self.view.frame.width - 60, height: 1000),
                options: NSStringDrawingOptions.usesFontLeading.union(NSStringDrawingOptions.usesLineFragmentOrigin),
                attributes: [
                    NSAttributedString.Key.font : UIFont.systemFont(ofSize: 16)
                ],
                context: nil)
            
            var itemWithImageSize = CGSize()
            let itemWithoutImageSize = CGSize(width: self.view.frame.width, height: rect.height + 33 + 10)
            
            if let messageImageHeight = messages[indexPath.item].messageImageHeight, let messageImageWidth = messages[indexPath.item].messageImageWidth {
                itemWithImageSize = CGSize(width: self.view.frame.width, height: rect.height + 33 + 10 + CGFloat(messageImageHeight / messageImageWidth * 220))
            }
            
            return messages[indexPath.item].messageImageUrl != nil ? itemWithImageSize : itemWithoutImageSize
        }
        
        return CGSize(width: self.view.frame.width, height: 75)
    }
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, insetForSectionAt section: Int) -> UIEdgeInsets {
        return UIEdgeInsets(top: 20, left: 0, bottom: 0, right: 0)
    }
    
    // MARK: - Helper
    
    func setupNavigationBarStyles(){
        self.navigationItem.largeTitleDisplayMode = UINavigationItem.LargeTitleDisplayMode.never
        self.navigationItem.title = self.user?.name
    }
    
    /** Helper - Networking **/
    
    func observeMessages(){
        guard let uid = Auth.auth().currentUser?.uid, let userId = self.user?.id else {return}
        
        Database.database().reference().child("messages/user-messages").child(uid).child(userId).observe(DataEventType.childAdded, with: { [unowned self] (snapshot) in

            let messageId = snapshot.key
            Database.database().reference().child("messages").child(messageId).observeSingleEvent(of: DataEventType.value, with: { [unowned self] (snapshot) in
                
                guard let dictionary = snapshot.value as? [String: Any] else {return}
                guard let fromId = dictionary["fromId"] as? String else {return}
                guard let toId = dictionary["toId"] as? String else {return}
                guard let message = dictionary["message"] as? String else {return}
                guard let timestamp = dictionary["timestamp"] as? String else {return}
                
                let newMessage = Message(
                    fromId: fromId,
                    toId: toId,
                    text: message,
                    timestamp: timestamp)
                
                if let messageImageUrl = dictionary["imageUrl"] as? String {
                    newMessage.messageImageUrl = messageImageUrl
                    if let messageImageWidth = dictionary["imageWidth"] as? Double {
                        newMessage.messageImageWidth = messageImageWidth
                        print("IMG W: \(messageImageWidth)")
                        if let messageImageHeight = dictionary["imageHeight"] as? Double {
                            newMessage.messageImageHeight = messageImageHeight
                        }
                    }
                }
                
                self.messages.append(newMessage)
                self.attemptReloadOfCollection()
            })
        })
    }
    
    var timer: Timer?
    
    private func attemptReloadOfCollection(){
        self.timer?.invalidate()
        self.timer = Timer.scheduledTimer(timeInterval: 0.1, target: self, selector: #selector(self.handleTableReload), userInfo: nil, repeats: false)
    }
    
    @objc func handleTableReload(){        
        // Sort the array by timestamp
        self.messages.sort(by: { (firstMessage, secondMessage) -> Bool in
            return Double(firstMessage.timestamp)! < Double(secondMessage.timestamp)!
        })
        
        DispatchQueue.main.async {
            self.collectionView.reloadData()
            let indexPath = IndexPath(item: self.messages.count - 1, section: 0)
            self.collectionView.scrollToItem(at: indexPath, at: UICollectionView.ScrollPosition.bottom, animated: true)
        }
    }
    
    
    /** Helper - Actions **/
    
    func didSendNewMessage(_ message: String) {
        if self.selectedPhoto != nil {
            self.sendMessageWithImage(message: message)
        } else {
            guard let uid = Auth.auth().currentUser?.uid else {return}
            guard let toId = user?.id else {return}
            let timeStamp = String(Date.timeIntervalSinceReferenceDate)
            let newValues = ["toId": toId, "fromId": uid,"message": message, "timestamp": timeStamp]
        
            Database.database().reference().child("messages").childByAutoId().updateChildValues(newValues) { (error, reference) in
                if let err = error {
                    print("Failed to send message: ", err)
                    return
                }
                
                if let messageId = reference.key {
                    Database.database().reference().child("messages/user-messages").child(uid).child(toId).updateChildValues([messageId: 0])
                    Database.database().reference().child("messages/user-messages").child(toId).child(uid).updateChildValues([messageId: 0])
                }
            }
        }
    }
    
    func sendMessageWithImage(message: String){
        if let image = self.selectedPhoto {
            self.composer.selectedImageViewContainer.isHidden = true
            let imageName = NSUUID().uuidString
            guard let uploadData = image.jpegData(compressionQuality: 0.2) else {return}
            
            let storageRef = Storage.storage().reference().child("message_images").child(imageName)
            storageRef.putData(uploadData, metadata: nil) { [unowned self] (metadata, error) in
                
                if let err = error {
                    print("Failed to upload image: ", err)
                    return
                }
                
                storageRef.downloadURL(completion: { (url, error) in
                    if let err = error {
                        print("Failed to fetch downloadURL: ", err)
                        return
                    }
                    
                    guard let imageUrl = url?.absoluteString else {return}
                    guard let uid = Auth.auth().currentUser?.uid else {return}
                    guard let toId = self.user?.id else {return}
                    let timeStamp = String(Date.timeIntervalSinceReferenceDate)
                    let newValues = ["toId": toId, "fromId": uid, "message": message, "imageUrl": imageUrl, "imageWidth": image.size.width, "imageHeight": image.size.height, "timestamp": timeStamp] as [String : Any]
                    
                    Database.database().reference().child("messages").childByAutoId().updateChildValues(newValues) { [unowned self] (error, reference) in
                        if let err = error {
                            print("Failed to send message: ", err)
                            return
                        }
                        
                        if let messageId = reference.key {
                            Database.database().reference().child("messages/user-messages").child(uid).child(toId).updateChildValues([messageId: 0])
                            Database.database().reference().child("messages/user-messages").child(toId).child(uid).updateChildValues([messageId: 0])
                        }
                        
                        self.photoIsSelected = false
                    }
                })
            }
        }
    }
    
    func didCancelPhoto() {
        self.photoIsSelected = false
    }
    
    func didAddPhoto() {
        let imagePickerController = UIImagePickerController()
        
        imagePickerController.delegate = self
        imagePickerController.allowsEditing = true

        present(imagePickerController, animated: true, completion: nil)
    }
    
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
        
        // If available use edited image over orginal image
        if let editedImage = info[UIImagePickerController.InfoKey.editedImage] as? UIImage {
            self.selectedPhoto = editedImage
            self.photoIsSelected = true
        } else if let originalImage = info[UIImagePickerController.InfoKey.originalImage] as? UIImage {
            self.selectedPhoto = originalImage
            self.photoIsSelected = true
        }
        
        dismiss(animated: true, completion: nil)
    }
    
    func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
        dismiss(animated: true, completion: nil)
    }
    
    func didTapPhoto(imageView: UIImageView) {
        self.performZoomInForImageView(imageView)
    }
    
    var startFrame: CGRect?
    var startImageView: UIImageView?
    var backgroundView: UIView?
    
    func performZoomInForImageView(_ imageView: UIImageView){
        
        startFrame = imageView.superview?.convert(imageView.frame, to: nil)
        self.startImageView = imageView
        self.startImageView?.isHidden = true
        
        let zoomImageView = UIImageView(frame: startFrame!)
        zoomImageView.contentMode = UIView.ContentMode.scaleAspectFill
        zoomImageView.image = imageView.image
        zoomImageView.isUserInteractionEnabled = true
        zoomImageView.addGestureRecognizer(UITapGestureRecognizer(target: self, action: #selector(handleZoomOut)))
        
        if let keyWindow = UIApplication.shared.keyWindow {
            backgroundView = UIView(frame: keyWindow.frame)
            backgroundView?.backgroundColor = UIColor.black
            backgroundView?.alpha = 0
            keyWindow.addSubview(backgroundView!)
            keyWindow.addSubview(zoomImageView)
            
            
            UIView.animate(withDuration: 0.5, delay: 0, usingSpringWithDamping: 1, initialSpringVelocity: 1, options: UIView.AnimationOptions.curveEaseOut, animations: {
                self.backgroundView?.alpha = 1
                self.composer.alpha = 0
                let height = (self.startFrame?.height)! / (self.startFrame?.width)! * keyWindow.frame.width
                
                zoomImageView.frame = CGRect(x: 0, y: 0, width: keyWindow.frame.width, height: height)
                
                zoomImageView.center = keyWindow.center
            }) { (complete) in
                // Completion
            }
        }
    }
    
    @objc func handleZoomOut(tapGesture: UITapGestureRecognizer){
        if let zoomOutImageView = tapGesture.view {
            zoomOutImageView.layer.cornerRadius = 14
            zoomOutImageView.clipsToBounds = true
            
            UIView.animate(withDuration: 0.5, delay: 0, usingSpringWithDamping: 1, initialSpringVelocity: 1, options: UIView.AnimationOptions.curveEaseOut, animations: {
                zoomOutImageView.frame = self.startFrame!
                self.backgroundView?.alpha = 0
                self.composer.alpha = 1
                
            }) { (complete) in
                zoomOutImageView.removeFromSuperview()
                self.startImageView?.isHidden = false
            }
        }
    }
}

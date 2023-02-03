//
//  SignupController.swift
//  FireChat
//
//  Created by Tye Porter on 1/10/19.
//  Copyright © 2019 Tye Porter. All rights reserved.
//

import UIKit
import FirebaseAuth
import FirebaseDatabase
import FirebaseStorage

class SignupController: UIViewController, UIImagePickerControllerDelegate, UINavigationControllerDelegate {
    
    // MARK:- Properties
    
    weak var chatsControllerRef: ChatsController?
    
    override var preferredStatusBarStyle: UIStatusBarStyle {
        return UIStatusBarStyle.lightContent
    }
    
    /** Properties - Views **/
    
    let plusPhotoButton: UIButton = {
        let button = UIButton(type: UIButton.ButtonType.system)
        button.setImage(UIImage(named: "add_photo"), for: UIControl.State.normal)
        button.addTarget(self, action: #selector(handleAddPhoto), for: UIControl.Event.touchUpInside)
        return button
    }()
    
    let emailTextField: UITextField = {
        let textField = UITextField()
        textField.placeholder = "Email"
        textField.backgroundColor = UIColor(white: 1, alpha: 0.9)
        textField.borderStyle = UITextField.BorderStyle.roundedRect
        textField.font = UIFont.systemFont(ofSize: 14)
        textField.keyboardAppearance = UIKeyboardAppearance.dark
        textField.addTarget(self, action: #selector(handleTextInputChange), for: UIControl.Event.editingChanged)
        return textField
    }()
    
    let usernameTextField: UITextField = {
        let textField = UITextField()
        textField.placeholder = "Username"
        textField.backgroundColor = UIColor(white: 1, alpha: 0.9)
        textField.borderStyle = UITextField.BorderStyle.roundedRect
        textField.font = UIFont.systemFont(ofSize: 14)
        textField.keyboardAppearance = UIKeyboardAppearance.dark
        textField.addTarget(self, action: #selector(handleTextInputChange), for: UIControl.Event.editingChanged)
        return textField
    }()
    
    let passwordTextField: UITextField = {
        let textField = UITextField()
        textField.placeholder = "Password"
        textField.backgroundColor = UIColor(white: 1, alpha: 0.9)
        textField.borderStyle = UITextField.BorderStyle.roundedRect
        textField.font = UIFont.systemFont(ofSize: 14)
        textField.isSecureTextEntry = true
        textField.keyboardAppearance = UIKeyboardAppearance.dark
        textField.addTarget(self, action: #selector(handleTextInputChange), for: UIControl.Event.editingChanged)
        return textField
    }()
    
    let confirmPasswordTextField: UITextField = {
        let textField = UITextField()
        textField.placeholder = "Confirm password"
        textField.backgroundColor = UIColor(white: 1, alpha: 0.9)
        textField.borderStyle = UITextField.BorderStyle.roundedRect
        textField.font = UIFont.systemFont(ofSize: 14)
        textField.isSecureTextEntry = true
        textField.keyboardAppearance = UIKeyboardAppearance.dark
        textField.addTarget(self, action: #selector(handleTextInputChange), for: UIControl.Event.editingChanged)
        return textField
    }()
    
    let signupButton: UIButton = {
        let button = UIButton()
        button.setTitle("Sign Up", for: UIControl.State.normal)
        button.backgroundColor = UIColor(red: 43/255, green: 125/255, blue: 237/255, alpha: 0.3)
        button.layer.cornerRadius = 5
        button.titleLabel?.font = UIFont.boldSystemFont(ofSize: 14)
        button.setTitleColor(UIColor.white, for: UIControl.State.normal)
        
        button.addTarget(self, action: #selector(handleSignup), for: UIControl.Event.touchUpInside)
        
        return button
    }()
    
    let alreadyHaveAccountButton: UIButton = {
        let button = UIButton(type: UIButton.ButtonType.system)
        let attributedTitle = NSMutableAttributedString(string: "Already have an account?  ", attributes: [
            NSAttributedString.Key.font : UIFont.systemFont(ofSize: 14),
            NSAttributedString.Key.foregroundColor : UIColor.white
            ])
        attributedTitle.append(NSAttributedString(string: "Login", attributes: [
            NSAttributedString.Key.font : UIFont.boldSystemFont(ofSize: 14),
            NSAttributedString.Key.foregroundColor : UIColor.rgb(red: 43, green: 125, blue: 237)
            ]))
        button.setAttributedTitle(attributedTitle, for: UIControl.State.normal)
        button.addTarget(self, action: #selector(showLoginController), for: UIControl.Event.touchUpInside)
        return button
    }()

    let containerView: UIView = {
        let view = UIView()
        view.backgroundColor = UIColor.rgb(red: 43, green: 43, blue: 43)
        return view
    }()


    let scrollView: UIScrollView = {
        let scroll = UIScrollView()
        scroll.translatesAutoresizingMaskIntoConstraints = false
        scroll.keyboardDismissMode = UIScrollView.KeyboardDismissMode.interactive
        return scroll
    }()
    
    
    // MARK:- Lifecycle
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // View setup
        self.view.backgroundColor = UIColor.rgb(red: 43, green: 43, blue: 43)
        
        // Add subviews
        self.view.addSubview(self.scrollView)
        self.scrollView.addSubview(self.containerView)
        self.scrollView.leadingAnchor.constraint(equalTo: self.view.leadingAnchor).isActive = true
        self.scrollView.topAnchor.constraint(equalTo: self.view.topAnchor).isActive = true
        self.scrollView.widthAnchor.constraint(equalTo: self.view.widthAnchor).isActive = true
        self.scrollView.heightAnchor.constraint(equalTo: self.view.heightAnchor).isActive = true

        self.containerView.anchor(width: self.view.frame.width, height: self.view.frame.height + 125, top: self.scrollView.topAnchor, bottom: nil, left: self.scrollView.leftAnchor, right: nil, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0)

        self.containerView.addSubview(self.plusPhotoButton)
        self.containerView.addSubview(self.alreadyHaveAccountButton)
        
        // Anchor subviews
        self.plusPhotoButton.anchor(width: 140, height: 140, top: self.containerView.topAnchor, bottom: nil, left: nil, right: nil, paddingTop: 40, paddingBottom: 0, paddingLeft: 0, paddingRight: 0)
        self.plusPhotoButton.centerXAnchor.constraint(equalTo: self.containerView.centerXAnchor).isActive = true
        setupInputFields()
        self.alreadyHaveAccountButton.anchor(width: 0, height: 50, top: nil, bottom: self.view.bottomAnchor, left: self.view.leftAnchor, right: self.view.rightAnchor, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0)
    }
    
    deinit {
        print("De-initializing an instance of SignupController")
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()

        self.scrollView.contentSize = self.containerView.frame.size
    }
    
    // MARK: - Delegation
    
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
        
        // If available use edited image over orginal image
        if let editedImage = info[UIImagePickerController.InfoKey.editedImage] as? UIImage {
            self.plusPhotoButton.setImage(editedImage.withRenderingMode(UIImage.RenderingMode.alwaysOriginal), for: UIControl.State.normal)
        } else if let originalImage = info[UIImagePickerController.InfoKey.originalImage] as? UIImage {
            self.plusPhotoButton.setImage(originalImage.withRenderingMode(UIImage.RenderingMode.alwaysOriginal), for: UIControl.State.normal)
        }
        
        self.plusPhotoButton.layer.cornerRadius = self.plusPhotoButton.frame.width / 2
        self.plusPhotoButton.layer.masksToBounds = true
        self.plusPhotoButton.layer.borderColor = UIColor.rgb(red: 43, green: 125, blue: 237).cgColor
        self.plusPhotoButton.layer.borderWidth = 5
        
        dismiss(animated: true, completion: nil)
    }
    
    // MARK:- Helper
    
    fileprivate func setupInputFields(){
        let stackView = UIStackView(arrangedSubviews: [self.emailTextField, self.usernameTextField, self.passwordTextField, self.confirmPasswordTextField, self.signupButton])
        stackView.distribution = UIStackView.Distribution.fillEqually
        stackView.axis = NSLayoutConstraint.Axis.vertical
        stackView.spacing = 10
        
        self.view.addSubview(stackView)
        stackView.anchor(width: 0, height: 257, top: self.plusPhotoButton.bottomAnchor, bottom: nil, left: self.containerView.leftAnchor, right: self.containerView.rightAnchor, paddingTop: 70, paddingBottom: 0, paddingLeft: 40, paddingRight: 40)
    }
    
    /** Helper - Actions **/
    
    @objc func handleAddPhoto(){
        // Adding photo...
        let imagePicker = UIImagePickerController()
        imagePicker.delegate = self
        imagePicker.allowsEditing = true
        present(imagePicker, animated: true, completion: nil)
    }
    
    @objc func handleTextInputChange(){
        let isEmailValid = self.emailTextField.text?.count ?? 0 > 0
        let isUsernameValid = self.usernameTextField.text?.count ?? 0 > 0
        let isPasswordValid = self.passwordTextField.text?.count ?? 0 > 0
        let isConfirmedPasswordValid = self.confirmPasswordTextField.text?.count ?? 0 > 0
        
        if isEmailValid && isUsernameValid && isPasswordValid && isConfirmedPasswordValid {
            self.signupButton.isEnabled = true
            self.signupButton.backgroundColor = UIColor.rgb(red: 43, green: 125, blue: 237)
        } else {
            self.signupButton.isEnabled = false
            self.signupButton.backgroundColor = UIColor(red: 43/255, green: 125/255, blue: 237/255, alpha: 0.3)
        }
    }
    
    @objc func handleSignup(){
        // Guard text fields
        guard let email = self.emailTextField.text else {return}
        guard let username = self.usernameTextField.text else {return}
        guard let password = self.passwordTextField.text else {return}
        guard let confirmedPassword = self.confirmPasswordTextField.text else {return}
        
        // Check if passwords match
        if password != confirmedPassword {
            print("Passwords do not match...")
            return
        } else {
            // Create new user via Firebase Auth
            Auth.auth().createUser(withEmail: email, password: password) { (result, error) in
                if let err = error {
                    print("Failed to create user: ", err)
                    return
                }
                
                // Retrieve image and get its data
                guard let image = self.plusPhotoButton.imageView?.image else {return}
                guard let uploadData = image.jpegData(compressionQuality: 0.1) else {return}
                
                // Create a randomized filename
                let filename = NSUUID().uuidString
                
                // Upload profile image vis Firebase Storage
                let storageRef = Storage.storage().reference().child("profile_images").child("\(filename).png")
                storageRef.putData(uploadData, metadata: nil, completion: { (metadata, error) in
                    if let err = error {
                        print("Failed to upload profile image: ", err)
                        return
                    }
                    
                    // Retrieve profile image downloadURL
                    storageRef.downloadURL(completion: { (downloadURL, error) in
                        if let err = error {
                            print("Failed to fetch downloadURL: ", err)
                            return
                        }
                        
                        guard let profileImageUrl = downloadURL?.absoluteString else {return}
                        
                        // Upon successfully creating user and uploading profile image...
                        guard let uid = result?.user.uid else {return}
                        let newValues = ["username": username, "email": email, "profileImageUrl": profileImageUrl]
                        Database.database().reference().child("users").child(uid).updateChildValues(newValues, withCompletionBlock: { (error, dbRef) in
                            if let err = error {
                                print("Failed to save user into database: ", err)
                                return
                            }
                            
                            print("Successfully saved user into database")
                            
                            self.chatsControllerRef?.controllerSetup()
                            self.dismiss(animated: true, completion: nil)
                        })
                    })
                })
            }
        }
    }
    
    @objc func showLoginController(){
        self.navigationController?.popViewController(animated: true)
    }
 
    
}

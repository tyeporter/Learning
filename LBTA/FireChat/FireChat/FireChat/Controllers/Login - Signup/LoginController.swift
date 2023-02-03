//
//  LoginController.swift
//  FireChat
//
//  Created by Tye Porter on 1/9/19.
//  Copyright © 2019 Tye Porter. All rights reserved.
//

import UIKit
import FirebaseAuth

class LoginController: UIViewController, UIScrollViewDelegate {
    
    // MARK: - Properties
    override var preferredStatusBarStyle: UIStatusBarStyle {
        return UIStatusBarStyle.lightContent
    }
    
    weak var chatsControllerRef: ChatsController?
    
    /** Properties - Views **/
    
    let logoContainerView: UIView = {
        let view = UIView()
        let imageView = UIImageView(image: UIImage(named: "firechatlogo_light"))
        imageView.contentMode = UIImageView.ContentMode.scaleAspectFill
        view.addSubview(imageView)
        imageView.anchor(width: 200, height: 50, top: nil, bottom: nil, left: nil, right: nil, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0)
        imageView.centerXAnchor.constraint(equalTo: view.centerXAnchor).isActive = true
        imageView.centerYAnchor.constraint(equalTo: view.centerYAnchor).isActive = true
        view.backgroundColor = UIColor.rgb(red: 43, green: 125, blue: 237)
        return view
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
    
    let loginButton: UIButton = {
        let button = UIButton(type: UIButton.ButtonType.system)
        button.setTitle("Login", for: UIControl.State.normal)
        button.backgroundColor = UIColor(red: 43/255, green: 125/255, blue: 237/255, alpha: 0.3)
        button.layer.cornerRadius = 5
        button.titleLabel?.font = UIFont.boldSystemFont(ofSize: 14)
        button.setTitleColor(UIColor.white, for: UIControl.State.normal)
        
        button.addTarget(self, action: #selector(handleLogin), for: UIControl.Event.touchUpInside)
        button.isEnabled = false
        return button
    }()
    
    let dontHaveAccountButton: UIButton = {
        let button = UIButton(type: UIButton.ButtonType.system)
        let attributedTitle = NSMutableAttributedString(string: "Don't have an account?  ", attributes: [
            NSAttributedString.Key.font : UIFont.systemFont(ofSize: 14),
            NSAttributedString.Key.foregroundColor : UIColor.white
            ])
        attributedTitle.append(NSAttributedString(string: "Sign Up", attributes: [
            NSAttributedString.Key.font : UIFont.boldSystemFont(ofSize: 14),
            NSAttributedString.Key.foregroundColor : UIColor.rgb(red: 43, green: 125, blue: 237)
            ]))
        button.setAttributedTitle(attributedTitle, for: UIControl.State.normal)
        button.addTarget(self, action: #selector(showSignupController), for: UIControl.Event.touchUpInside)
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
    
    // MARK: - Lifecycle Methods
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.navigationController?.isNavigationBarHidden = true
        self.view.backgroundColor = UIColor.rgb(red: 43, green: 125, blue: 237)
        self.scrollView.delegate = self

        self.view.addSubview(self.scrollView)
        self.scrollView.addSubview(self.containerView)
        self.scrollView.leadingAnchor.constraint(equalTo: self.view.leadingAnchor).isActive = true
        self.scrollView.topAnchor.constraint(equalTo: self.view.topAnchor).isActive = true
        self.scrollView.widthAnchor.constraint(equalTo: self.view.widthAnchor).isActive = true
        self.scrollView.heightAnchor.constraint(equalTo: self.view.heightAnchor).isActive = true

        self.containerView.anchor(width: self.view.frame.width, height: self.view.frame.height + 50, top: self.scrollView.topAnchor, bottom: nil, left: self.scrollView.leftAnchor, right: nil, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0)

        self.containerView.addSubview(self.logoContainerView)
        self.containerView.addSubview(self.dontHaveAccountButton)
        self.logoContainerView.anchor(width: 0, height: 200, top: self.containerView.topAnchor, bottom: nil, left: self.containerView.leftAnchor, right: self.containerView.rightAnchor, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0)
        setupInputFields()

        self.dontHaveAccountButton.anchor(width: 0, height: 50, top: nil, bottom: self.view.bottomAnchor, left: self.view.leftAnchor, right: self.view.rightAnchor, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0)
    }

    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
    }
    
    deinit {
        print("De-initializing an instance of LoginController")
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()

        self.scrollView.contentSize = self.containerView.frame.size
    }

    // MARK: - Helper Methods
    
    fileprivate func setupInputFields(){
        let stackView = UIStackView(arrangedSubviews: [self.emailTextField, self.passwordTextField, self.loginButton])
        stackView.distribution = UIStackView.Distribution.fillEqually
        stackView.axis = NSLayoutConstraint.Axis.vertical
        stackView.spacing = 10
        
        self.view.addSubview(stackView)
        stackView.anchor(width: 0, height: 150, top: self.logoContainerView.bottomAnchor, bottom: nil, left: self.containerView.leftAnchor, right: self.containerView.rightAnchor, paddingTop: 70, paddingBottom: 0, paddingLeft: 40, paddingRight: 40)
    }
    
    /** Helper Methods - Actions **/
    
    @objc func handleTextInputChange(){
        let isEmailValid = self.emailTextField.text?.count ?? 0 > 0
        let isPasswordValid = self.passwordTextField.text?.count ?? 0 > 0
        
        if isEmailValid && isPasswordValid {
            self.loginButton.isEnabled = true
            self.loginButton.backgroundColor = UIColor.rgb(red: 43, green: 125, blue: 237)
        } else {
            self.loginButton.isEnabled = false
            self.loginButton.backgroundColor = UIColor(red: 43/255, green: 125/255, blue: 237/255, alpha: 0.3)
        }
    }
    
    @objc func handleLogin(){
        guard let email = self.emailTextField.text else {return}
        guard let password = self.passwordTextField.text else {return}
        
        // Try to sign in...
        Auth.auth().signIn(withEmail: email, password: password) { (result, error) in
            if let err = error {
                print("Failed to sign in with email: \(email)", err)
                return
            }
            
            // Successfully sign in...
            print("Successfully signed in with email: \(email)")
            
            self.chatsControllerRef?.controllerSetup()
            self.dismiss(animated: true, completion: nil)
        }
    }
    
    @objc func showSignupController(){
        let signupController = SignupController()
        signupController.chatsControllerRef = chatsControllerRef
        self.navigationController?.pushViewController(signupController, animated: true)
    }


}

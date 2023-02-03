//
//  ComposerController.swift
//  FireChat
//
//  Created by Tye Porter on 1/21/19.
//  Copyright © 2019 Tye Porter. All rights reserved.
//

import UIKit

protocol ComposerDelegate {
    func didSendNewMessage(_ message: String)
    func didAddPhoto()
    func didCancelPhoto()
}

class Composer: UIView, UITextFieldDelegate {
    
    var delegate: ComposerDelegate?
    
    let container: UIView = {
        let view = UIView()
        view.backgroundColor = UIColor.rgb(red: 50, green: 51, blue: 52)
        return view
    }()
    
    let shadow: UIView = {
        let shadow = UIView()
        shadow.backgroundColor = UIColor.gray
        return shadow
    }()
    
    let sendButton: UIButton = {
        let sendButton = UIButton(type: UIButton.ButtonType.system)
        sendButton.setTitle("Send", for: UIControl.State.normal)
        sendButton.titleLabel?.font = UIFont.boldSystemFont(ofSize: 16)
        sendButton.isEnabled = false
        sendButton.addTarget(self, action: #selector(handleSend), for: UIControl.Event.touchUpInside)
        return sendButton
    }()
    
    let composerTextField: UITextField = {
        let composer = UITextField()
        composer.attributedPlaceholder = NSAttributedString(string: "Enter a message...", attributes: [NSAttributedString.Key.foregroundColor : UIColor.gray])
        composer.textColor = UIColor.white
        composer.addTarget(self, action: #selector(textFieldDidChange(_:)), for: UIControl.Event.editingChanged)
        composer.keyboardAppearance = UIKeyboardAppearance.dark
        return composer
    }()

    let addPhotoButton: UIButton = {
        let addPhotoButton = UIButton(type: UIButton.ButtonType.custom)
        addPhotoButton.setImage(UIImage(named: "upload_image")?.withRenderingMode(UIImage.RenderingMode.alwaysTemplate), for: UIControl.State.normal)
        addPhotoButton.tintColor = UIColor.gray
        addPhotoButton.imageView?.contentMode = UIImageView.ContentMode.scaleAspectFit

        addPhotoButton.addTarget(self, action: #selector(handleAddPhoto), for: UIControl.Event.touchUpInside)
        return addPhotoButton
    }()

    @objc func handleAddPhoto(){
        self.delegate?.didAddPhoto()
    }
    
    let selectedImageViewContainer: UIView = {
        let view = UIView()
        view.backgroundColor = UIColor.rgb(red: 51, green: 52, blue: 53)
        view.layer.borderWidth = 1
        view.layer.borderColor = UIColor.clear.cgColor
        view.layer.cornerRadius = 25
        view.isHidden = true
        return view
    }()
    
    let selectedViewImageView: UIImageView = {
        let imageView = UIImageView()
        imageView.contentMode = UIView.ContentMode.scaleAspectFill
        imageView.layer.cornerRadius = 25
        imageView.image = UIImage(named: "thumbnail")
        imageView.layer.masksToBounds = true
        imageView.layer.borderWidth = 3
        imageView.layer.borderColor = UIColor.white.cgColor
        return imageView
    }()
    
    let selectedImageViewCancelButton: UIButton = {
        let button = UIButton(type: UIButton.ButtonType.custom)
        button.tintColor = UIColor.gray
        button.backgroundColor = UIColor.white
        button.layer.borderWidth = 3
        button.layer.cornerRadius = 12.5
        button.layer.borderColor = UIColor.white.cgColor
        button.setImage(UIImage(named: "cancel")?.withRenderingMode(UIImage.RenderingMode.alwaysTemplate), for: UIControl.State.normal)
        
        button.addTarget(self, action: #selector(cancelAddPhoto), for: UIControl.Event.touchUpInside)
        return button
    }()
    
    @objc func cancelAddPhoto(){
        print("Canceling photo")
        self.delegate?.didCancelPhoto()
    }
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        self.backgroundColor = UIColor.rgb(red: 50, green: 51, blue: 52)
        
        self.addSubview(self.container)
        self.container.anchor(width: 0, height: 50, top: nil, bottom: self.bottomAnchor, left: self.leftAnchor, right: self.rightAnchor, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0)
        
        self.container.addSubview(self.shadow)
        self.shadow.anchor(width: 0, height: 0.5, top: self.container.topAnchor, bottom: nil, left: self.container.leftAnchor, right: self.container.rightAnchor, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0, centerX: nil, centerY: nil, offsetX: 0, offsetY: 0)

        self.container.addSubview(self.addPhotoButton)
        self.addPhotoButton.anchor(width: 25, height: 0, top: self.container.topAnchor, bottom: self.container.bottomAnchor, left: self.container.leftAnchor, right: nil, paddingTop: 0, paddingBottom: 0, paddingLeft: 8, paddingRight: 0, centerX: nil, centerY: nil, offsetX: 0, offsetY: 0)
        
        self.container.addSubview(self.sendButton)
        self.sendButton.anchor(width: 80, height: 0, top: self.container.topAnchor, bottom: self.container.bottomAnchor, left: nil, right: self.container.rightAnchor, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0, centerX: nil, centerY: nil, offsetX: 0, offsetY: 0)
        
        self.composerTextField.delegate = self
        self.container.addSubview(self.composerTextField)
        self.composerTextField.anchor(width: 0, height: 0, top: self.container.topAnchor, bottom: self.container.bottomAnchor, left: self.addPhotoButton.rightAnchor, right: self.sendButton.leftAnchor, paddingTop: 0, paddingBottom: 0, paddingLeft: 8, paddingRight: 0, centerX: nil, centerY: nil, offsetX: 0, offsetY: 0)
        
        self.addSubview(self.selectedImageViewContainer)
        self.selectedImageViewContainer.anchor(width: 50, height: 50, top: self.topAnchor, bottom: nil, left: nil, right: self.rightAnchor, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 15)
        
        self.selectedImageViewContainer.addSubview(self.selectedViewImageView)
        self.selectedImageViewContainer.addSubview(self.selectedImageViewCancelButton)
        
        self.selectedViewImageView.anchor(width: 0, height: 0, top: self.selectedImageViewContainer.topAnchor, bottom: self.selectedImageViewContainer.bottomAnchor, left: self.selectedImageViewContainer.leftAnchor, right: self.selectedImageViewContainer.rightAnchor, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0)
        self.selectedImageViewCancelButton.anchor(width: 25, height: 25, top: self.selectedImageViewContainer.topAnchor, bottom: nil, left: nil, right: self.selectedImageViewContainer.rightAnchor, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0)
    }
    
    @objc func textFieldDidChange(_ textField: UITextField){
        let text = textField.text ?? ""
        if text == ""  {
            self.sendButton.isEnabled = false
        } else {
            self.sendButton.isEnabled = true
        }
    }
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        if textField.text != nil && textField.text != "" {
            self.handleSend()
        }
        return true
    }
    
    @objc func handleSend(){
        self.delegate?.didSendNewMessage(self.composerTextField.text ?? "")
        self.composerTextField.text = ""
        self.composerTextField.resignFirstResponder()
        self.sendButton.isEnabled = false
    }
    
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
}

# TwitterFeedUI
Twitter Feed User Interface 🐦

## Features 
![Finished App](screenshot.png)
- Displays multiple UICollectionView sections 
- Top section displays header/footer supplementary cells
- Each section has custom UICollectionViewCells
- Each cell has a dynamic size which is based off the cell text
- Fetches a list of user and tweet objects from a JSON data source via a shared data task (URLSession)
- Dynamically displays cell content based on the JSON data source
- Easy cell registration of UICollectionViewCells with Datasource class from LBTAComponents
- Caches profile images using CachedImageView class from LBTAComponents

### Pods
[LBTAComponents](https://cocoapods.org/pods/LBTAComponents)

Copyright © 2019 Tye Porter

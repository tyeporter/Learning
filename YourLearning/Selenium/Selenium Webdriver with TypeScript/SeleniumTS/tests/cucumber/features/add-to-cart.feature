Feature: Add to Cart

Scenario: Verify Item is Added to Cart
    Given User visits "http://teststore.automationtesting.co.uk/men/1-1-hummingbird-printed-t-shirt.html#/1-size-s/8-color-white"
    When User presses the "add-to-cart" button
    Then Add to cart modal should be shown


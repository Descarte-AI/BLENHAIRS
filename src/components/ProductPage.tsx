Here's the fixed version with all missing closing brackets added:

```javascript
                                </div>
                              )}
                            </div>
                            <div className="flex items-center space-x-1">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} size={16} className="text-yellow-400 fill-current" />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700">{review.review}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
```

I've added the missing closing brackets for several nested components and blocks that were incomplete in the original code. The main fixes were:

1. Closing the review rating stars mapping block
2. Closing multiple nested div elements
3. Closing the reviews mapping block
4. Closing the reviews tab content section
5. Closing the tabs container

The code should now be properly structured with all matching opening and closing brackets.
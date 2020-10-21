class motoBike:
  def __init__(self, value):
    self.value = value
    

myMotoBike = motoBike(2000)

print(myMotoBike.value)

def valueDepreciation(value):
  while value > 1000:
    value= value *.9
    print(value)
  
 
valueDepreciation(myMotoBike.value)